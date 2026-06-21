import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Info, CheckCircle, HelpCircle, Lock, X } from 'lucide-react';
import { submitVote } from '../utils/supabasePlaceholder';

export default function VotingSimulator({ lang, text, onClose, onVoteSuccess }) {
  const [formData, setFormData] = useState({ name: '', idNumber: '' });
  const [listSelected, setListSelected] = useState(false);
  const [candidateSelected, setCandidateSelected] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Allow alphanumeric characters and spaces
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Basic Validation
    if (!formData.name.trim() || !formData.idNumber.trim()) {
      setErrorMessage(text.voting.errorFields);
      return;
    }

    if (!listSelected || !candidateSelected) {
      setErrorMessage(text.voting.errorSelect);
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.name,
        idNumber: formData.idNumber,
        listSelected: 102,
        candidateNumber: 2
      };
      
      const response = await submitVote(payload);
      
      if (response.success) {
        setIsSuccess(true);
        if (onVoteSuccess) {
          onVoteSuccess();
        }
      } else {
        setErrorMessage(response.error || 'Something went wrong.');
      }
    } catch (err) {
      setErrorMessage('Network error, please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', idNumber: '' });
    setListSelected(false);
    setCandidateSelected(false);
    setIsSuccess(false);
    setErrorMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="max-w-4xl w-full mx-auto my-8 relative">
        
        {/* Outer Form Box */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl overflow-hidden relative">
          
          {/* Top Security Header */}
          <div className="bg-gradient-to-r from-algerian-green to-algerian-dark text-white px-8 py-4 flex items-center justify-between border-b border-algerian-gold/20">
            <div className="flex items-center gap-3">
              <Lock className="h-4.5 w-4.5 text-algerian-gold" />
              <span className="text-xs font-bold tracking-wider uppercase text-slate-100">
                {text.voting.voteNotice}
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full text-[10px] font-bold border border-white/10">
                <ShieldCheck className="h-3.5 w-3.5 text-algerian-gold" />
                <span>SECURE PROTOCOL</span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Close Voting Modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.form
                key="voting-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleFormSubmit}
                className="p-8 sm:p-12 space-y-8"
              >
                {/* Instruction alert */}
                <div className="flex gap-4 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-sm">
                  <Info className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="leading-relaxed">{text.voting.instruction}</p>
                </div>

                {/* Input Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      {text.voting.labelName}
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder={text.voting.placeholderName}
                      className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-algerian-green/20 focus:border-algerian-green transition-all text-sm font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      {text.voting.labelId}
                    </label>
                    <input
                      type="tel"
                      name="idNumber"
                      value={formData.idNumber}
                      onChange={handleInputChange}
                      required
                      placeholder={text.voting.placeholderId}
                      inputMode="tel"
                      dir="ltr"
                      className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-algerian-green/20 focus:border-algerian-green transition-all text-sm font-medium tracking-wider"
                    />
                  </div>
                </div>

                {/* BALLOT PAPER GRAPHIC */}
                <div className="border-2 border-dashed border-slate-200 rounded-3xl p-6 bg-slate-50/50">
                  <span className="block text-sm font-extrabold text-slate-800 mb-4 text-center sm:text-start">
                    {text.voting.ballotHeader}
                  </span>

                  {/* List Selector Box */}
                  <div 
                    onClick={() => {
                      setListSelected(!listSelected);
                      if (!listSelected === false) {
                        setCandidateSelected(false); // reset candidate if list unselected
                      }
                    }}
                    className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white ${
                      listSelected 
                        ? 'border-algerian-green bg-algerian-green/5 shadow-md' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        listSelected ? 'border-algerian-green bg-algerian-green' : 'border-slate-300'
                      }`}>
                        {listSelected && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                      </div>
                      <div>
                        <span className="font-extrabold text-slate-800 block text-base font-arabic">
                          {text.voting.listLabel}
                        </span>
                        <span className="text-xs text-slate-500 font-semibold block mt-0.5">
                          List Number: 102 | القائمة 102
                        </span>
                      </div>
                    </div>
                    <div className="bg-algerian-gold text-slate-900 font-black px-4 py-2 rounded-xl text-sm border border-algerian-gold-hover self-start sm:self-auto">
                      102
                    </div>
                  </div>

                  {/* Candidate List (Visible only if list selected, mock options) */}
                  <AnimatePresence>
                    {listSelected && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-6 space-y-4 overflow-hidden"
                      >
                        <div className="h-px bg-slate-200 my-4" />
                        <span className="block text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">
                          {text.voting.candidateSelection}
                        </span>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Candidate 1 (Mock) */}
                          <div className="p-4 rounded-xl border border-slate-200 bg-white opacity-50 cursor-not-allowed flex items-center justify-between text-slate-400">
                            <span className="text-sm font-semibold">1. المرشح الأول (Candidate #1)</span>
                            <span className="text-xs font-bold bg-slate-100 text-slate-400 px-2 py-0.5 rounded">N° 1</span>
                          </div>

                          {/* Candidate 2 (Imad Rezayguia) */}
                          <div 
                            onClick={() => setCandidateSelected(!candidateSelected)}
                            className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between bg-white ${
                              candidateSelected
                                ? 'border-algerian-red bg-algerian-red/5 shadow-sm'
                                : 'border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                                candidateSelected ? 'border-algerian-red bg-algerian-red' : 'border-slate-300'
                              }`}>
                                {candidateSelected && (
                                  <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                    <path strokeLinecap="round" strokeLinejoin="round" stroke="d" d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </div>
                              <span className="text-sm font-extrabold text-slate-800 font-arabic">2. عماد رزايقية (Imad Rezayguia)</span>
                            </div>
                            <span className="text-xs font-black bg-algerian-red text-white px-2.5 py-0.5 rounded-lg border border-algerian-red/10">N° 2</span>
                          </div>

                          {/* Candidate 3 (Mock) */}
                          <div className="p-4 rounded-xl border border-slate-200 bg-white opacity-50 cursor-not-allowed flex items-center justify-between text-slate-400">
                            <span className="text-sm font-semibold">3. المرشح الثالث (Candidate #3)</span>
                            <span className="text-xs font-bold bg-slate-100 text-slate-400 px-2 py-0.5 rounded">N° 3</span>
                          </div>

                          {/* Candidate 4 (Mock) */}
                          <div className="p-4 rounded-xl border border-slate-200 bg-white opacity-50 cursor-not-allowed flex items-center justify-between text-slate-400">
                            <span className="text-sm font-semibold">4. المرشح الرابع (Candidate #4)</span>
                            <span className="text-xs font-bold bg-slate-100 text-slate-400 px-2 py-0.5 rounded">N° 4</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm font-semibold flex items-center gap-3">
                    <HelpCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Submit Action Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-algerian-green to-algerian-green/90 text-white font-bold text-base py-4 rounded-2xl shadow-lg hover:shadow-xl hover:from-algerian-red hover:to-algerian-red/90 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed border border-white/10"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                      <span>{text.voting.votingProgress}</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-5 w-5 text-algerian-gold" />
                      <span>{text.voting.buttonVote}</span>
                    </>
                  )}
                </button>

              </motion.form>
            ) : (
              // Success Screen Component
              <motion.div
                key="voting-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-8 sm:p-16 text-center space-y-6 flex flex-col items-center"
              >
                {/* Circular Success Badge */}
                <div className="w-20 h-20 rounded-full bg-algerian-green/10 border-2 border-algerian-green flex items-center justify-center mb-2 gold-pulse">
                  <CheckCircle className="h-10 w-10 text-algerian-green" />
                </div>

                {/* Candidate Badge */}
                <div className="flex gap-2 items-center justify-center">
                  <span className="bg-algerian-green text-white font-extrabold px-3 py-1 rounded-xl text-xs">
                    {text.nav.listNum}
                  </span>
                  <span className="bg-algerian-red text-white font-extrabold px-3 py-1 rounded-xl text-xs">
                    {text.nav.candidateNum}
                  </span>
                </div>

                {/* Slogan details */}
                <h3 className="text-2xl sm:text-3xl font-black text-slate-800 font-arabic">
                  {text.voting.successTitle}
                </h3>
                
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl">
                  {text.voting.successMessage}
                </p>

                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl max-w-xl text-xs text-slate-400 text-center leading-relaxed">
                  {text.voting.successSub}
                </div>

                {/* Reset button */}
                <button
                  onClick={resetForm}
                  className="mt-6 px-8 py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-sm font-bold shadow-md transition-all"
                >
                  {lang === 'ar' ? 'التصويت مجدداً' : 'Vote Again'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>
    </div>
  );
}
