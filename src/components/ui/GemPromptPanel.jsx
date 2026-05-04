import React, { useState } from 'react';
import { useProposal } from '../../context/ProposalContext';
import { refinePrompt } from '../../engine/geminiRefiner';

export function GemPromptPanel() {
  const { setHasPassedGemPanel, setRefinedPromptText } = useProposal();

  const [idea, setIdea] = useState('');
  const [prd, setPrd] = useState('');
  const [isRefining, setIsRefining] = useState(false);
  const [refinedOutput, setRefinedOutput] = useState('');
  const [error, setError] = useState(null);

  const handleRefine = async () => {
    if (!idea.trim()) {
      setError("Please enter a basic project idea first.");
      return;
    }
    setError(null);
    setIsRefining(true);
    
    try {
      const result = await refinePrompt(idea, prd);
      setRefinedOutput(result);
    } catch (err) {
      setError(err.message || "Failed to refine prompt. Please check your Gemini API Key and try again.");
    } finally {
      setIsRefining(false);
    }
  };

  const handleContinue = () => {
    // Save the potentially user-edited refined prompt
    setRefinedPromptText(refinedOutput || idea); // fallback to original idea if they skipped
    setHasPassedGemPanel(true);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      width: '100vw',
      background: 'linear-gradient(135deg, #060A14 0%, #0F172A 100%)',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      boxSizing: 'border-box',
      overflow: 'hidden',
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 100,
    }}>
      {/* Background ambient light */}
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '20%',
        width: 300,
        height: 300,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(14, 165, 233, 0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '10%',
        left: '20%',
        width: 400,
        height: 400,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        width: '100%',
        maxWidth: 700,
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(51, 65, 85, 0.3)',
        borderRadius: 24,
        padding: 40,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        animation: 'floatUp 0.6s ease-out',
        maxHeight: '90vh',
        overflowY: 'auto',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            background: 'linear-gradient(135deg, #0EA5E9, #8B5CF6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 4px 20px rgba(139, 92, 246, 0.3)',
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
          </div>
          <h1 style={{
            fontSize: 26,
            fontWeight: 800,
            color: '#F8FAFC',
            margin: 0,
            letterSpacing: '-0.02em',
          }}>
            Gem Prompt Studio
          </h1>
          <p style={{ color: '#94A3B8', fontSize: 14, marginTop: 8 }}>
            Transform a vague idea into a highly structured proposal blueprint.
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: 12,
            padding: 12,
            color: '#FCA5A5',
            fontSize: 13,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {/* Input Phase */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', color: '#CBD5E1', fontSize: 12, fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              1. Basic Idea (Required)
            </label>
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="e.g. An AI-powered underground mine safety system for Sateroid Innovations..."
              style={{
                width: '100%',
                padding: 16,
                borderRadius: 12,
                background: 'rgba(30, 41, 59, 0.5)',
                border: '1px solid rgba(51, 65, 85, 0.5)',
                color: '#F1F5F9',
                fontSize: 14,
                fontFamily: 'inherit',
                minHeight: 80,
                resize: 'vertical',
                outline: 'none',
              }}
              onFocus={(e) => e.target.style.borderColor = '#0EA5E9'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(51, 65, 85, 0.5)'}
            />
          </div>

          <div>
            <label style={{ display: 'block', color: '#CBD5E1', fontSize: 12, fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              2. Optional Context / PRD
            </label>
            <textarea
              value={prd}
              onChange={(e) => setPrd(e.target.value)}
              placeholder="Paste any requirements, technical constraints, or additional context here..."
              style={{
                width: '100%',
                padding: 16,
                borderRadius: 12,
                background: 'rgba(30, 41, 59, 0.5)',
                border: '1px solid rgba(51, 65, 85, 0.5)',
                color: '#F1F5F9',
                fontSize: 14,
                fontFamily: 'inherit',
                minHeight: 100,
                resize: 'vertical',
                outline: 'none',
              }}
              onFocus={(e) => e.target.style.borderColor = '#0EA5E9'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(51, 65, 85, 0.5)'}
            />
          </div>
        </div>

        {/* Refine Action */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={handleRefine}
            disabled={isRefining || !idea.trim()}
            style={{
              padding: '12px 24px',
              borderRadius: 12,
              background: isRefining ? 'rgba(51, 65, 85, 0.5)' : 'linear-gradient(135deg, #0EA5E9, #8B5CF6)',
              color: '#FFF',
              border: 'none',
              fontSize: 14,
              fontWeight: 600,
              cursor: isRefining || !idea.trim() ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: (!isRefining && idea.trim()) ? '0 4px 14px rgba(139, 92, 246, 0.3)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            {isRefining ? (
              <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2v4m0 12v4m-7.07-3.93l2.83-2.83m8.49-8.49l2.83-2.83M2 12h4m12 0h4m-3.93 7.07l-2.83-2.83M7.76 7.76L4.93 4.93" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
            {isRefining ? 'Refining with Gemini...' : 'Refine with AI'}
          </button>
        </div>

        {/* Output Phase */}
        {refinedOutput && (
          <div style={{
            animation: 'fadeIn 0.5s ease',
            marginTop: 8,
            paddingTop: 24,
            borderTop: '1px solid rgba(51, 65, 85, 0.4)',
            display: 'flex',
            flexDirection: 'column',
            gap: 16
          }}>
            <div>
              <label style={{ display: 'block', color: '#10B981', fontSize: 12, fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                3. Refined Prompt (Editable)
              </label>
              <textarea
                value={refinedOutput}
                onChange={(e) => setRefinedOutput(e.target.value)}
                style={{
                  width: '100%',
                  padding: 16,
                  borderRadius: 12,
                  background: 'rgba(16, 185, 129, 0.05)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  color: '#F1F5F9',
                  fontSize: 14,
                  fontFamily: 'inherit',
                  minHeight: 180,
                  resize: 'vertical',
                  outline: 'none',
                  lineHeight: 1.6,
                }}
                onFocus={(e) => e.target.style.borderColor = '#10B981'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(16, 185, 129, 0.3)'}
              />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button
                onClick={() => setRefinedOutput('')}
                style={{
                  padding: '10px 20px',
                  borderRadius: 10,
                  background: 'rgba(51, 65, 85, 0.3)',
                  border: '1px solid rgba(51, 65, 85, 0.5)',
                  color: '#CBD5E1',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Clear
              </button>
              <button
                onClick={handleContinue}
                style={{
                  padding: '10px 24px',
                  borderRadius: 10,
                  background: '#10B981',
                  color: '#064E3B',
                  border: 'none',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)',
                  transition: 'all 0.2s',
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                Continue to Proposal
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
      <style>{`
        @keyframes floatUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
