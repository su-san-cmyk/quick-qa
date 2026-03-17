import React, { useState, useEffect, useCallback } from 'react';
import type { Question } from '../types';

interface LearningProps {
    questions: Question[];
    onBack: () => void;
}

const Learning: React.FC<LearningProps> = ({ questions, onBack }) => {
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
    const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
    const [results, setResults] = useState<Record<string, boolean | null>>({});
    const [showAnswers, setShowAnswers] = useState(false);

    // シャッフルされた出題キュー（問題のインデックス配列）
    const [queue, setQueue] = useState<number[]>([]);
    // 現在のキュー内の位置
    const [queueIndex, setQueueIndex] = useState(-1);

    // Fisher-Yates シャッフルアルゴリズム
    const shuffle = useCallback((array: number[]) => {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }, []);

    // 新しいキューを作成して最初の問題を表示
    const startNewCycle = useCallback(() => {
        if (questions.length === 0) return;
        const initialQueue = questions.map((_, i) => i);
        const shuffledQueue = shuffle(initialQueue);
        setQueue(shuffledQueue);
        setQueueIndex(0);

        // 最初の問題を設定
        const q = questions[shuffledQueue[0]];
        setCurrentQuestion(q);
        resetState();
    }, [questions, shuffle]);

    useEffect(() => {
        if (questions.length > 0 && queue.length === 0) {
            startNewCycle();
        }
    }, [questions, queue.length, startNewCycle]);

    const resetState = () => {
        setUserAnswers({});
        setResults({});
        setShowAnswers(false);
    };

    const nextQuestion = () => {
        if (questions.length === 0) return;

        const nextIdx = queueIndex + 1;

        // 1周終わったかチェック
        if (nextIdx >= queue.length) {
            // 次の周を開始（リシャッフル）
            const initialQueue = questions.map((_, i) => i);
            const shuffledQueue = shuffle(initialQueue);
            setQueue(shuffledQueue);
            setQueueIndex(0);
            setCurrentQuestion(questions[shuffledQueue[0]]);
        } else {
            // キューの次の問題へ
            setQueueIndex(nextIdx);
            setCurrentQuestion(questions[queue[nextIdx]]);
        }
        resetState();
    };

    const handleInputChange = (fieldId: string, value: string) => {
        setUserAnswers(prev => ({ ...prev, [fieldId]: value }));
    };

    const handleCheckAnswers = () => {
        if (!currentQuestion) return;

        const newResults: Record<string, boolean> = {};
        currentQuestion.subQuestions.forEach(sq => {
            sq.fields.forEach(field => {
                const userAnswer = userAnswers[field.id] || '';
                // 完全一致判定
                newResults[field.id] = userAnswer === field.correctAnswer;
            });
        });

        setResults(newResults);
        setShowAnswers(true);
    };

    if (!currentQuestion) {
        return <div className="container">問題がありません。</div>;
    }

    return (
        <div className="container">
            <div className="nav">
                <button className="button button-secondary" onClick={onBack}>戻る</button>
            </div>

            <div style={{ textAlign: 'right', fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
                学習進捗: {queueIndex + 1} / {queue.length} 問目
            </div>

            <h2>{currentQuestion.title}</h2>
            <div className="question-body">{currentQuestion.body}</div>

            <div className="sub-questions-list">
                {currentQuestion.subQuestions.map((sq) => (
                    <div key={sq.id} className="sub-question">
                        {sq.label && <label className="sub-label">{sq.label}</label>}

                        <div className="fields-list">
                            {sq.fields.map(field => (
                                <div key={field.id} style={{ marginBottom: '1rem' }}>
                                    {field.label && <span style={{ fontSize: '1.1rem', marginRight: '0.5rem' }}>{field.label}：</span>}
                                    <textarea
                                        className="input"
                                        rows={field.correctAnswer.includes('\n') ? 3 : 1}
                                        value={userAnswers[field.id] || ''}
                                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                                        disabled={showAnswers}
                                        placeholder="回答を入力"
                                        style={{ width: field.label ? 'calc(100% - 4rem)' : '100%', display: field.label ? 'inline-block' : 'block', verticalAlign: 'middle' }}
                                    />
                                    {showAnswers && (
                                        <div className={`result ${results[field.id] ? 'result-correct' : 'result-incorrect'}`}>
                                            {results[field.id] ? '正解' : '不正解'}
                                        </div>
                                    )}
                                    {showAnswers && !results[field.id] && (
                                        <div className="answer-display">
                                            <strong>正解:</strong> <br />
                                            <span style={{ whiteSpace: 'pre-wrap' }}>{field.correctAnswer}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                {!showAnswers ? (
                    <button className="button" onClick={handleCheckAnswers}>答え合わせ</button>
                ) : (
                    <button className="button" onClick={nextQuestion}>
                        {queueIndex === queue.length - 1 ? '次の周へ（シャッフル）' : '次の問題'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default Learning;
