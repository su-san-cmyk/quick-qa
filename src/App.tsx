import { useState } from 'react';
import Home from './components/Home';
import Learning from './components/Learning';
import Admin from './components/Admin';
import { useQuestions } from './hooks/useQuestions';

type Screen = 'HOME' | 'LEARNING' | 'ADMIN';

function App() {
  const [screen, setScreen] = useState<Screen>('HOME');
  const { questions, addQuestion, updateQuestion, deleteQuestion } = useQuestions();

  const handleBackToHome = () => setScreen('HOME');

  return (
    <div className="app">
      {screen === 'HOME' && (
        <Home
          questionCount={questions.length}
          onStart={() => setScreen('LEARNING')}
          onAdmin={() => setScreen('ADMIN')}
        />
      )}

      {screen === 'LEARNING' && (
        <Learning
          questions={questions}
          onBack={handleBackToHome}
        />
      )}

      {screen === 'ADMIN' && (
        <Admin
          questions={questions}
          onAdd={addQuestion}
          onUpdate={updateQuestion}
          onDelete={deleteQuestion}
          onBack={handleBackToHome}
        />
      )}
    </div>
  );
}

export default App;
