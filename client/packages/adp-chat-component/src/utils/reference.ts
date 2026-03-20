import type { Record, Reference } from '../model/chat'
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

function mergeReferenceDetail(reference: Reference, detail: Reference): void {
  const merged: Reference = {
    ...detail,
    ...reference,
    Id: reference.Id || detail.Id || detail.ReferBizId || '',
    Name: reference.Name || detail.Name || detail.DocName || '',
  }
  Object.assign(reference, merged)
}

function collectType2References(records: Record[]): Reference[] {
  const references: Reference[] = []
  for (const record of records) {
    for (const reference of record.References || []) {
      if (reference.Type === 2 && reference.Id) {
        references.push(reference)
      }
    }
  }
  return references
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

  const referencesById = new Map<string, Reference[]>()
  for (const reference of type2References) {
    const references = referencesById.get(reference.Id) || []
    references.push(reference)
    referencesById.set(reference.Id, references)
    const cacheKey = getCacheKey(reference.Id, applicationId, shareId)
    const cachedDetail = cache?.get(cacheKey)
    if (cachedDetail) {
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
      const detailId = detail.Id || detail.ReferBizId
      if (!detailId) {
        continue
      }
      const cacheKey = getCacheKey(detailId, applicationId, shareId)
      cache?.set(cacheKey, detail)
      const references = referencesById.get(detailId) || []
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
