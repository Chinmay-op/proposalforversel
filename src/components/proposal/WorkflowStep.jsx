import React from 'react'

export function WorkflowStep({ steps, accentColor, variant }) {
  const accent = accentColor || '#1A56DB'

  return (
    <div style={{ width: '100%', boxSizing: 'border-box' }}>
      {(steps || []).map((step, i) => (
        <div key={i} style={{
          display: 'flex',
          gap: 18,
          marginBottom: 20,
          position: 'relative',
        }}>
          {/* Step number circle + connector line */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{
              width: 36,
              height: 36,
              minWidth: 36,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${accent}, ${accent}C0)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 3px 10px ${accent}30`,
            }}>
              <span style={{
                fontSize: 14,
                fontWeight: 800,
                color: '#FFFFFF',
              }}>
                {step.stepNumber || i + 1}
              </span>
            </div>
            {/* Gradient connector line (hidden for last item) */}
            {i < steps.length - 1 && (
              <div style={{
                width: 2,
                flex: 1,
                background: `linear-gradient(180deg, ${accent}40, ${accent}10)`,
                marginTop: 4,
                marginBottom: -16,
                borderRadius: 1,
              }} />
            )}
          </div>

          {/* Content card */}
          <div style={{
            flex: 1,
            paddingTop: 2,
            padding: '10px 16px',
            background: 'rgba(248,250,252,0.6)',
            borderRadius: 10,
            border: '1px solid #F1F5F9',
          }}>
            <h4 style={{
              fontSize: 15,
              fontWeight: 750,
              color: '#1E293B',
              letterSpacing: '-0.01em',
            }}>
              {step.title}
            </h4>
            <p style={{
              fontSize: 13,
              color: '#64748B',
              marginTop: 4,
              lineHeight: 1.65,
            }}>
              {step.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
