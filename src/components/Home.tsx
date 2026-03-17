import React from 'react';

interface HomeProps {
    questionCount: number;
    onStart: () => void;
    onAdmin: () => void;
}

const Home: React.FC<HomeProps> = ({ questionCount, onStart, onAdmin }) => {
    return (
        <div className="container" style={{ textAlign: 'center' }}>
            <h1>一問一答 学習</h1>

            <div className="stat">
                <p>現在の登録問題数: <strong>{questionCount}</strong> 問</p>
            </div>

            <div className="menu-list">
                <button className="button" onClick={onStart} style={{ width: '300px' }}>
                    学習を始める
                </button>
                <button className="button button-secondary" onClick={onAdmin} style={{ width: '300px' }}>
                    問題を管理する
                </button>
            </div>
        </div>
    );
};

export default Home;
