"use client";

import { useActionState } from "react";
import { gradeSubmission } from "@/actions/assignment";

const initialState = { success: false, error: "" };

export default function GradingForm({ submission }: { submission: any }) {
    // @ts-ignore
    const [state, formAction] = useActionState(gradeSubmission, initialState);

    return (
        <form action={formAction} style={{ backgroundColor: '#f0fdf4', padding: '1rem', borderRadius: '4px', border: '1px solid #bbf7d0' }}>
            <input type="hidden" name="submissionId" value={submission.id} />

            <h4 style={{ fontWeight: 'bold', color: '#166534', marginBottom: '1rem' }}>採点・フィードバック</h4>

            <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: '#166534' }}>点数 (0-100)</label>
                <input
                    type="number"
                    name="grade"
                    min="0"
                    max="100"
                    defaultValue={submission.grade ?? ""}
                    style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #86efac', width: '100px' }}
                // required
                />
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: '#166534' }}>フィードバックコメント</label>
                <textarea
                    name="feedback"
                    rows={3}
                    defaultValue={submission.feedback ?? ""}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #86efac' }}
                    placeholder="よくできています！..."
                    required
                ></textarea>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button
                    type="submit"
                    style={{ padding: '0.5rem 1.5rem', backgroundColor: '#16a34a', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    保存する
                </button>
                {state?.success && <span style={{ color: '#15803d' }}>保存しました</span>}
                {state?.error && <span style={{ color: '#dc2626' }}>{state.error}</span>}
            </div>
        </form>
    );
}
