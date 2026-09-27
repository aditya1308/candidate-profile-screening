import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

const escapeHtml = (value = '') =>
  value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  })[character]);

const formatInterviewDate = (date, time) => {
  if (!date || !time) return 'To be confirmed';

  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'full',
    timeStyle: 'short'
  }).format(new Date(`${date}T${time}`));
};

const EmailSchedulingModal = ({
  show,
  onClose,
  onSend,
  candidateName,
  candidateEmail,
  round
}) => {
  const [subject, setSubject] = useState('');
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewTime, setInterviewTime] = useState('');
  const [duration, setDuration] = useState('60');
  const [interviewMode, setInterviewMode] = useState('Online');
  const [location, setLocation] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const minimumDate = new Date().toISOString().split('T')[0];

  const formattedInterviewDate = useMemo(
    () => formatInterviewDate(interviewDate, interviewTime),
    [interviewDate, interviewTime]
  );

  const generatedBody = useMemo(() => {
    const safeName = escapeHtml(candidateName);
    const safeMode = escapeHtml(interviewMode);
    const safeLocation = escapeHtml(location);
    const safeMeetingLink = escapeHtml(meetingLink);
    const safeNotes = escapeHtml(additionalNotes);

    return `
      <div style="font-family: Arial, sans-serif; color: #222; line-height: 1.6; max-width: 680px; margin: auto; border: 1px solid #dddddd;">
        <div style="background: #e30613; padding: 22px 28px;">
          <div style="color: #ffffff; font-size: 22px; font-weight: bold;">
            SOCIETE GENERALE
          </div>
          <div style="color: #ffffff; margin-top: 6px; font-size: 14px;">
            Candidate Recruitment
          </div>
        </div>

        <div style="padding: 28px;">
          <p>Dear ${safeName},</p>

          <p>
            Thank you for your interest in Societe Generale.
            We are pleased to invite you to the next stage of our interview process.
          </p>

          <h3 style="color: #e30613; border-bottom: 2px solid #e30613; padding-bottom: 8px;">
            Interview Details
          </h3>

          <table style="width: 100%; border-collapse: collapse;">
            <tbody>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; width: 38%;">Interview round</td>
                <td style="padding: 8px 0;">Round ${escapeHtml(String(round))}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Date and time</td>
                <td style="padding: 8px 0;">${escapeHtml(formattedInterviewDate)}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Duration</td>
                <td style="padding: 8px 0;">${escapeHtml(duration)} minutes</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Interview mode</td>
                <td style="padding: 8px 0;">${safeMode}</td>
              </tr>
              ${
                location
                  ? `<tr>
                      <td style="padding: 8px 0; font-weight: bold;">Location</td>
                      <td style="padding: 8px 0;">${safeLocation}</td>
                    </tr>`
                  : ''
              }
              ${
                meetingLink
                  ? `<tr>
                      <td style="padding: 8px 0; font-weight: bold;">Meeting link</td>
                      <td style="padding: 8px 0;">
                        <a href="${safeMeetingLink}" style="color: #e30613;">
                          Join interview
                        </a>
                      </td>
                    </tr>`
                  : ''
              }
            </tbody>
          </table>

          ${
            additionalNotes
              ? `<p style="margin-top: 22px;">
                  <strong>Additional information:</strong><br />
                  ${safeNotes}
                </p>`
              : ''
          }

          

          <p>
            Best regards,<br />
            <strong>Talent Acquisition Team</strong><br />
            Societe Generale
          </p>
        </div>

        <div style="background: #f4f4f4; padding: 14px 28px; color: #666; font-size: 12px;">
          This is an automated interview invitation. Please do not forward this email.
        </div>
      </div>
    `;
  }, [
    candidateName,
    round,
    formattedInterviewDate,
    duration,
    interviewMode,
    location,
    meetingLink,
    additionalNotes
  ]);

  useEffect(() => {
    if (!show) return;

    setSubject(
      `[Societe Generale] Interview Invitation - Round ${round}`
    );
    setInterviewDate('');
    setInterviewTime('');
    setDuration('60');
    setInterviewMode('Online');
    setLocation('');
    setMeetingLink('');
    setAdditionalNotes('');
  }, [show, round]);

  const handleSend = async () => {
    if (!interviewDate || !interviewTime) {
      alert('Please select an interview date and time.');
      return;
    }

    if (interviewMode === 'Online' && !meetingLink.trim()) {
      alert('Please provide the online meeting link.');
      return;
    }

    if (interviewMode === 'In-person' && !location.trim()) {
      alert('Please provide the interview location.');
      return;
    }

    setLoading(true);

    try {
      await onSend(subject.trim(), generatedBody);
      onClose();
    } catch (error) {
      console.error('Error sending interview email:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 p-4">
      <div className="max-h-[95vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white">
        <div className="flex items-center justify-between bg-[#e30613] px-6 py-5 text-white">
          <div>
            <h2 className="text-xl font-bold">
              Schedule Interview Invitation
            </h2>
            <p className="mt-1 text-sm text-red-100">
              {candidateName} | Round {round}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-2xl text-white hover:text-red-100"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-2">
          <section className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-semibold">
                Candidate email
              </label>
              <input
                value={candidateEmail}
                readOnly
                className="w-full rounded border bg-gray-100 px-3 py-2"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold">
                Email subject
              </label>
              <input
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                className="w-full rounded border px-3 py-2 focus:border-[#e30613] focus:outline-none"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-semibold">
                  Interview date
                </label>
                <input
                  type="date"
                  min={minimumDate}
                  value={interviewDate}
                  onChange={(event) => setInterviewDate(event.target.value)}
                  className="w-full rounded border px-3 py-2"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold">
                  Interview time
                </label>
                <input
                  type="time"
                  value={interviewTime}
                  onChange={(event) => setInterviewTime(event.target.value)}
                  className="w-full rounded border px-3 py-2"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-semibold">
                  Duration
                </label>
                <select
                  value={duration}
                  onChange={(event) => setDuration(event.target.value)}
                  className="w-full rounded border px-3 py-2"
                >
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">60 minutes</option>
                  <option value="90">90 minutes</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold">
                  Interview mode
                </label>
                <select
                  value={interviewMode}
                  onChange={(event) => setInterviewMode(event.target.value)}
                  className="w-full rounded border px-3 py-2"
                >
                  <option value="Online">Online</option>
                  <option value="In-person">In-person</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
            </div>

            {interviewMode !== 'Online' && (
              <input
                placeholder="Office location"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                className="w-full rounded border px-3 py-2"
              />
            )}

            {interviewMode !== 'In-person' && (
              <input
                type="url"
                placeholder="Online meeting link"
                value={meetingLink}
                onChange={(event) => setMeetingLink(event.target.value)}
                className="w-full rounded border px-3 py-2"
              />
            )}

            <textarea
              rows={4}
              placeholder="Additional notes for the candidate"
              value={additionalNotes}
              onChange={(event) => setAdditionalNotes(event.target.value)}
              className="w-full resize-y rounded border px-3 py-2"
            />

            <div className="flex justify-end gap-3 border-t pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="rounded border px-4 py-2 text-gray-700"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSend}
                disabled={loading || !subject.trim()}
                className="rounded bg-[#e30613] px-5 py-2 font-semibold text-white hover:bg-[#b80510] disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Invitation'}
              </button>
            </div>
          </section>

          <section>
            <h3 className="mb-2 text-sm font-semibold text-gray-700">
              Email preview
            </h3>

            <iframe
              title="Interview invitation preview"
              srcDoc={generatedBody}
              className="h-[620px] w-full rounded border bg-white"
            />
          </section>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default EmailSchedulingModal;