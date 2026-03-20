import type { Record, Reference } from '../model/chat-v2'
import type { ReferenceDetailParams } from '../service/api'

export type ReferenceDetailFetcher = (params: ReferenceDetailParams) => Promise<Reference[]>

export interface HydrateType2ReferencesOptions {
  applicationId?: string
  shareId?: string
  cache?: Map<string, Reference>
  pending?: Set<string>
  fetcher: ReferenceDetailFetcher
}

function getScopeKey(applicationId?: string, shareId?: string): string {
  if (shareId) {
    return `share:${shareId}`
  }
  return `app:${applicationId || ''}`
}

function getCacheKey(referenceId: string, applicationId?: string, shareId?: string): string {
  return `${getScopeKey(applicationId, shareId)}:${referenceId}`
}

function getReferenceId(reference: Reference): string | undefined {
  return reference.Id || reference.ReferBizId || reference.DocRefer?.ReferBizId || reference.QaRefer?.ReferBizId
}

function getReferenceName(reference: Reference): string | undefined {
  return reference.Name || reference.DocName || reference.DocRefer?.DocName
}

function getReferenceUrl(reference: Reference): string | undefined {
  return reference.Url || reference.DocRefer?.Url || reference.WebSearchRefer?.Url
}

function mergeReferenceDetail(reference: Reference, detail: Reference): void {
  const detailId = getReferenceId(detail)
  const merged: Reference = {
    ...detail,
    ...reference,
    Id: getReferenceId(reference) || detailId,
    ReferBizId: reference.ReferBizId || detail.ReferBizId || detailId,
    Name: getReferenceName(reference) || getReferenceName(detail),
    Url: getReferenceUrl(reference) || getReferenceUrl(detail),
  }
  Object.assign(reference, merged)
}

function collectType2References(records: Record[]): Reference[] {
  const references: Reference[] = []
  for (const record of records) {
    for (const message of record.Messages || []) {
      for (const content of message.Contents || []) {
        for (const reference of content.References || []) {
          if (reference.Type === 2 && getReferenceId(reference)) {
            references.push(reference)
          }
        }
      }
    }
  }
  return references
}

function collectType2ReferencesById(records: Record[]): Map<string, Reference[]> {
  const referencesById = new Map<string, Reference[]>()
  for (const reference of collectType2References(records)) {
    const referenceId = getReferenceId(reference)
    if (!referenceId) {
      continue
    }
    const references = referencesById.get(referenceId) || []
    references.push(reference)
    referencesById.set(referenceId, references)
  }
  return referencesById
}

export async function hydrateType2References(
  records: Record[],
  options: HydrateType2ReferencesOptions,
): Promise<void> {
  const { applicationId, shareId, fetcher, cache, pending } = options
  const type2References = collectType2References(records)
  if (type2References.length === 0) {
    return
  }

  const referencesById = collectType2ReferencesById(records)
  for (const [referenceId, references] of referencesById.entries()) {
    const cacheKey = getCacheKey(referenceId, applicationId, shareId)
    const cachedDetail = cache?.get(cacheKey)
    if (!cachedDetail) {
      continue
    }
    for (const reference of references) {
      mergeReferenceDetail(reference, cachedDetail)
    }
  }

  const referenceIdsToFetch: string[] = []
  for (const [referenceId, references] of referencesById.entries()) {
    if (references.some((reference) => reference.PageContent || reference.OrgData)) {
      continue
    }
    const cacheKey = getCacheKey(referenceId, applicationId, shareId)
    if (cache?.has(cacheKey) || pending?.has(cacheKey)) {
      continue
    }
    referenceIdsToFetch.push(referenceId)
  }

  if (referenceIdsToFetch.length === 0) {
    return
  }

  const pendingKeys = referenceIdsToFetch.map((referenceId) => getCacheKey(referenceId, applicationId, shareId))
  for (const pendingKey of pendingKeys) {
    pending?.add(pendingKey)
  }

  try {
    const details = await fetcher({
      ApplicationId: applicationId,
      ShareId: shareId,
      ReferenceIds: referenceIdsToFetch,
    })

    for (const detail of details) {
      const detailId = getReferenceId(detail)
      if (!detailId) {
        continue
      }
      const cacheKey = getCacheKey(detailId, applicationId, shareId)
      cache?.set(cacheKey, detail)
      const references = collectType2ReferencesById(records).get(detailId) || referencesById.get(detailId) || []
      for (const reference of references) {
        mergeReferenceDetail(reference, detail)
      }
    }
  } finally {
    for (const pendingKey of pendingKeys) {
      pending?.delete(pendingKey)
    }
  }
}
