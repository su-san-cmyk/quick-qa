import React, { useState } from 'react';
import type { Question, SubQuestion, AnswerField } from '../types';

interface AdminProps {
    questions: Question[];
    onAdd: (q: Question) => void;
    onUpdate: (q: Question) => void;
    onDelete: (id: string) => void;
    onBack: () => void;
}

const Admin: React.FC<AdminProps> = ({ questions, onAdd, onUpdate, onDelete, onBack }) => {
    const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
    const [isAdding, setIsAdding] = useState(false);

    // フォーム用のステート
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [subQuestions, setSubQuestions] = useState<SubQuestion[]>([]);

    const startAdd = () => {
        setTitle('');
        setBody('');
        setSubQuestions([{
            id: Date.now().toString(),
            label: '',
            fields: [{ id: (Date.now() + 1).toString(), label: '', correctAnswer: '' }]
        }]);
        setIsAdding(true);
        setEditingQuestion(null);
    };

    const startEdit = (q: Question) => {
        setEditingQuestion(q);
        setTitle(q.title);
        setBody(q.body);
        setSubQuestions(q.subQuestions);
        setIsAdding(false);
    };

    const addSubQuestion = () => {
        setSubQuestions([...subQuestions, {
            id: Date.now().toString(),
            label: '',
            fields: [{ id: (Date.now() + 1).toString(), label: '', correctAnswer: '' }]
        }]);
    };

    const removeSubQuestion = (id: string) => {
        setSubQuestions(subQuestions.filter(sq => sq.id !== id));
    };

    const handleSubLabelChange = (id: string, value: string) => {
        setSubQuestions(subQuestions.map(sq => sq.id === id ? { ...sq, label: value } : sq));
    };

    const addField = (subId: string) => {
        setSubQuestions(subQuestions.map(sq => {
            if (sq.id === subId) {
                return {
                    ...sq,
                    fields: [...sq.fields, { id: Date.now().toString(), label: '', correctAnswer: '' }]
                };
            }
            return sq;
        }));
    };

    const removeField = (subId: string, fieldId: string) => {
        setSubQuestions(subQuestions.map(sq => {
            if (sq.id === subId) {
                return {
                    ...sq,
                    fields: sq.fields.filter(f => f.id !== fieldId)
                };
            }
            return sq;
        }));
    };

    const handleFieldChange = (subId: string, fieldId: string, property: keyof AnswerField, value: string) => {
        setSubQuestions(subQuestions.map(sq => {
            if (sq.id === subId) {
                return {
                    ...sq,
                    fields: sq.fields.map(f => f.id === fieldId ? { ...f, [property]: value } : f)
                };
            }
            return sq;
        }));
    };

    const handleSave = () => {
        const q: Question = {
            id: editingQuestion ? editingQuestion.id : Date.now().toString(),
            title,
            body,
            subQuestions
        };

        if (editingQuestion) {
            onUpdate(q);
        } else {
            onAdd(q);
        }
        cancel();
    };

    const cancel = () => {
        setIsAdding(false);
        setEditingQuestion(null);
    };

    if (isAdding || editingQuestion) {
        return (
            <div className="container">
                <h3>{isAdding ? '問題を追加' : '問題を編集'}</h3>
                <div className="card">
                    <label className="sub-label">タイトル</label>
                    <input className="input" value={title} onChange={e => setTitle(e.target.value)} placeholder="例: 問１" />

                    <label className="sub-label" style={{ marginTop: '1rem' }}>問い本文</label>
                    <textarea className="input" rows={4} value={body} onChange={e => setBody(e.target.value)} />

                    <h4 style={{ marginTop: '2rem' }}>小問構成</h4>
                    {subQuestions.map((sq, index) => (
                        <div key={sq.id} style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '4px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <strong>小問 {index + 1}</strong>
                                <button onClick={() => removeSubQuestion(sq.id)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>小問を削除</button>
                            </div>

                            <label className="sub-label">小問ラベル (例: (1)何国の人か)</label>
                            <input className="input" value={sq.label} onChange={e => handleSubLabelChange(sq.id, e.target.value)} />

                            <div style={{ marginLeft: '1rem', marginTop: '1.5rem', borderLeft: '3px solid #eee', paddingLeft: '1rem' }}>
                                <h5>回答フィールド</h5>
                                {sq.fields.map((field) => (
                                    <div key={field.id} style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px dashed #eee' }}>
                                       <div
  style={{
    display: 'flex',
    gap: '1rem',
    alignItems: 'flex-start',
    flexWrap: 'wrap'
  }}
>
  <div style={{ flex: 1, minWidth: '150px' }}>
    <label className="sub-label" style={{ fontSize: '0.8rem' }}>
      表示ラベル (例: 父)
    </label>
    <input
      className="input"
      style={{ fontSize: '0.9rem', padding: '0.5rem' }}
      value={field.label}
      onChange={e => handleFieldChange(sq.id, field.id, 'label', e.target.value)}
    />
  </div>

  <div style={{ flex: 2, minWidth: '200px' }}>
    <label className="sub-label" style={{ fontSize: '0.8rem' }}>
      正解
    </label>
    <textarea
      className="input"
      style={{ fontSize: '0.9rem', padding: '0.5rem' }}
      rows={2}
      value={field.correctAnswer}
      onChange={e =>
        handleFieldChange(sq.id, field.id, 'correctAnswer', e.target.value)
      }
    />
  </div>

  {sq.fields.length > 1 && (
    <button
      onClick={() => removeField(sq.id, field.id)}
      style={{
        color: '#999',
        marginTop: '1.5rem',
        minWidth: '40px'
      }}
    >
      ✕
    </button>
  )}
</div>
                                    </div>
                                ))}
                                <button className="button button-secondary" style={{ fontSize: '0.8rem', padding: '0.3rem 1rem' }} onClick={() => addField(sq.id)}>回答フィールドを追加</button>
                            </div>
                        </div>
                    ))}
                    <button className="button button-secondary" onClick={addSubQuestion} style={{ width: '100%', marginTop: '1rem' }}>新しい小問ブロックを追加</button>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button className="button" onClick={handleSave}>保存</button>
                    <button className="button button-secondary" onClick={cancel}>キャンセル</button>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="nav">
                <button className="button button-secondary" onClick={onBack}>戻る</button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2>問題一覧</h2>
                <button className="button" onClick={startAdd}>新規追加</button>
            </div>

            <div className="list">
                {questions.map(q => (
                    <div key={q.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <strong>{q.title}</strong>: {q.body.substring(0, 30)}...
                        </div>
                        <div>
                            <button className="button button-secondary" onClick={() => startEdit(q)} style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}>編集</button>
                            <button className="button button-secondary" onClick={() => onDelete(q.id)} style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', marginLeft: '0.5rem', borderColor: 'red', color: 'red' }}>削除</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Admin;
