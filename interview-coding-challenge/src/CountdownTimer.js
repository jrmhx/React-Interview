import { useState, useEffect} from 'react';

const CountdownTimer = () => {
  // TODO: Implement countdown timer logic here
  const [duration, setDuration] = useState('') // for user input
  const [secondLeft, setSecondLeft] = useState(0);
  const [isStart, setIsStart] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false);
  const [isPaused, setIsPaused] = useState(false)
  

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  useEffect(() => {
  if (!isStart) return;

  if (secondLeft <= 0) {
    setIsCompleted(true);
    setIsStart(false);
    return;
  }

  const timer = setTimeout(() => {
    setSecondLeft(secondLeft - 1);
  }, 1000);

  // clear when unmounted
  return () => clearTimeout(timer);
}, [isStart, secondLeft]);


  const handleStart = () => {
    const seconds = parseInt(duration);
    if (seconds > 0) {
      setSecondLeft(seconds);
      setIsStart(true);
      setIsCompleted(false);
    }
  };

  const handleToggle = () => {
    setIsStart(!isStart);
    setIsPaused(!isPaused);
  };

  const handleReset = () => {
    setIsStart(false);
    setIsPaused(false)
    setSecondLeft(0);
    setDuration('');
    setIsCompleted(false);
  };

  return (
    <div style={{ 
      backgroundColor: '#f5f5f5', 
      padding: '40px', 
      borderRadius: '8px',
      margin: '20px 0',
      textAlign: 'center'
    }}>
      <h2>Countdown Timer</h2>
      
      {/* input field */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="number"
          value={duration}
          onChange={(e) => {
            const value = e.target.value;
            // validate if its a negative number input 
            if (value === '' || (parseInt(value) >= 0)) {
              setDuration(value);
            } else {
              setDuration('');
            }
          }}
          placeholder="Enter Second(s)"
          disabled={isPaused || isStart}
          style={{ padding: '10px', fontSize: '16px', width: '200px' }}
        />
      </div>

      {/* display time MM:SS */}
      <div style={{ fontSize: '48px', fontWeight: 'bold', margin: '20px 0' }}>
        {formatTime(secondLeft)}
      </div>

      {/* completion message */}
      {isCompleted && (
        <div style={{ color: 'green', fontSize: '24px', marginBottom: '20px' }}>
          Completed!
        </div>
      )}

      {/* buttons */}
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        {secondLeft === 0 ? (
          <button onClick={handleStart} style={{ padding: '10px 20px', fontSize: '16px' }}>
            Start
          </button>
        ) : (
          <button onClick={handleToggle} style={{ padding: '10px 20px', fontSize: '16px' }}>
            {isStart ? 'Stop' : 'Resume'}
          </button>
        )}
        <button onClick={handleReset} style={{ padding: '10px 20px', fontSize: '16px' }}>
          Reset
        </button>
      </div>
    </div>
  );
};

export default CountdownTimer;


// General thinking process about designing a class/struct/obj/component/...:
// single responsibility principle (SRP)
// 1. States -> Mutation? Mutablity? Boundary(public/private? scope? closure?)
// 1.1 State Mutation -> Side Effect? Hook? ...
// 2. Behaviour (Functions Method ...)
// 3. Lifecycle (for react component its start when mounted to DOM; render when state update; and end when unmounted)
// 4. Dependency -> Decoupling? Dependency Injection?
// 5. Concurrency -> Race conditation -> Dead Locks
// 6. If there is NO Garbage Collector -> ownership/value copy/ref/lifecycle scope

// Input field (Behaviour+State)
// for duration (seconds) (States)
// Start/Stop button (State + Behaviour)
// Reset button (Behaviour)
// Display time in MM:SS format (helper functions)
// Show completion message (State)

// Usecase: Input 125(seconds) -> Display(MM:SS) 02:05 -> Click start -> 02:04... 00:00 -> show complete