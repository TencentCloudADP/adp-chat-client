'use client';

import type { ReactNode } from 'react';

interface PropItem {
  name: string;
  type: string;
  default?: string;
  required?: boolean;
  description: string;
}

interface EventItem {
  name: string;
  params?: string;
  description: string;
}

interface SlotItem {
  name: string;
  description: string;
}

interface MethodItem {
  name: string;
  params?: string;
  returns?: string;
  description: string;
}

function TableWrapper({ children, title }: { children: ReactNode; title: string }) {
  return (
    <div className="my-6">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <div className="overflow-x-auto border border-fd-border rounded-lg">
        {children}
      </div>
    </div>
  );
}

export function PropsTable({ data }: { data: PropItem[] }) {
  if (!data || data.length === 0) return null;
  
  return (
    <TableWrapper title="Props">
      <table className="api-table">
        <thead>
          <tr>
            <th style={{ width: '20%' }}>属性名</th>
            <th style={{ width: '25%' }}>类型</th>
            <th style={{ width: '15%' }}>默认值</th>
            <th style={{ width: '40%' }}>说明</th>
          </tr>
        </thead>
        <tbody>
          {data.map((prop) => (
            <tr key={prop.name}>
              <td>
                <span className="prop-name">{prop.name}</span>
                {prop.required && <span className="prop-required">*</span>}
              </td>
              <td><code>{prop.type}</code></td>
              <td>
                {prop.default ? (
                  <code>{prop.default}</code>
                ) : (
                  <span className="prop-default">-</span>
                )}
              </td>
              <td>{prop.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableWrapper>
  );
}

export function EventsTable({ data }: { data: EventItem[] }) {
  if (!data || data.length === 0) return null;
  
  return (
    <TableWrapper title="Events">
      <table className="api-table">
        <thead>
          <tr>
            <th style={{ width: '20%' }}>事件名</th>
            <th style={{ width: '35%' }}>参数</th>
            <th style={{ width: '45%' }}>说明</th>
          </tr>
        </thead>
        <tbody>
          {data.map((event) => (
            <tr key={event.name}>
              <td><span className="prop-name">{event.name}</span></td>
              <td>
                {event.params ? (
                  <code>{event.params}</code>
                ) : (
                  <span className="prop-default">-</span>
                )}
              </td>
              <td>{event.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableWrapper>
  );
}

export function SlotsTable({ data }: { data: SlotItem[] }) {
  if (!data || data.length === 0) return null;
  
  return (
    <TableWrapper title="Slots">
      <table className="api-table">
        <thead>
          <tr>
            <th style={{ width: '30%' }}>插槽名</th>
            <th style={{ width: '70%' }}>说明</th>
          </tr>
        </thead>
        <tbody>
          {data.map((slot) => (
            <tr key={slot.name}>
              <td><span className="prop-name">{slot.name}</span></td>
              <td>{slot.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableWrapper>
  );
}

export function MethodsTable({ data }: { data: MethodItem[] }) {
  if (!data || data.length === 0) return null;
  
  return (
    <TableWrapper title="Methods (Expose)">
      <table className="api-table">
        <thead>
          <tr>
            <th style={{ width: '20%' }}>方法名</th>
            <th style={{ width: '25%' }}>参数</th>
            <th style={{ width: '15%' }}>返回值</th>
            <th style={{ width: '40%' }}>说明</th>
          </tr>
        </thead>
        <tbody>
          {data.map((method) => (
            <tr key={method.name}>
              <td><span className="prop-name">{method.name}</span></td>
              <td>
                {method.params ? (
                  <code>{method.params}</code>
                ) : (
                  <span className="prop-default">-</span>
                )}
              </td>
              <td>
                {method.returns ? (
                  <code>{method.returns}</code>
                ) : (
                  <span className="prop-default">void</span>
                )}
              </td>
              <td>{method.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableWrapper>
  );
}
