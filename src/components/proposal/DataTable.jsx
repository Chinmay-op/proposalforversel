import React from 'react'

/**
 * DataTable — Premium themed table for comparisons, metrics, specs, timelines.
 * Compact density to fit within A4 page constraints.
 * Max recommended: 6 rows × 4 columns to avoid page overflow.
 */
export function DataTable({ headers = [], rows = [], accentColor = '#1A56DB', caption }) {
  if (!headers.length && !rows.length) return null

  // Safety: cap at 8 rows to prevent overflow
  const safeRows = rows.slice(0, 8)

  return (
    <div style={{
      width: '100%',
      background: '#FFFFFF',
      borderRadius: 10,
      border: `1px solid ${accentColor}18`,
      overflow: 'hidden',
      boxShadow: '0 1px 4px rgba(0,0,0,0.02)',
      marginTop: 6,
      marginBottom: 6,
    }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        textAlign: 'left',
        fontSize: 10.5,
        color: '#334155',
        tableLayout: 'fixed',
      }}>
        <thead>
          <tr>
            {headers.map((header, i) => (
              <th key={i} style={{
                background: `${accentColor}0A`,
                padding: '8px 12px',
                fontWeight: 700,
                color: accentColor,
                textTransform: 'uppercase',
                letterSpacing: 0.8,
                fontSize: 9,
                borderBottom: `2px solid ${accentColor}18`,
                textAlign: 'left',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {safeRows.map((row, rowIndex) => (
            <tr key={rowIndex} style={{
              background: rowIndex % 2 === 0 ? '#FFFFFF' : '#FAFBFC',
            }}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} style={{
                  padding: '7px 12px',
                  borderBottom: rowIndex === safeRows.length - 1 ? 'none' : '1px solid #F1F5F9',
                  color: cellIndex === 0 ? '#0F172A' : '#475569',
                  fontWeight: cellIndex === 0 ? 600 : 400,
                  lineHeight: 1.4,
                  fontSize: 10.5,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {caption && (
        <div style={{
          padding: '5px 12px',
          fontSize: 9,
          color: '#94A3B8',
          borderTop: '1px solid #F1F5F9',
          fontStyle: 'italic',
        }}>
          {caption}
        </div>
      )}
    </div>
  )
}
