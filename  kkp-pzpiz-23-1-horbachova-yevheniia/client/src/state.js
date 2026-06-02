export const appState = {
  screen: 'home',
  user: null,
  classId: null,
  wordSetId: null,
  assignmentId: null,
  studySource: 'assignment',
  studyQueue: null,
  studyCards: null,
  studyLanguage: '',
  studyIndex: 0,
  showTranslation: false,
  studyCorrect: 0,
  studyChecked: false,
  studyTyped: '',
  studyLastCorrect: false,
  flashCards: null,
  flashQueue: null,
  flashLanguage: '',
  flashIndex: 0,
  flashFlipped: false,
  testQuestions: null,
  testAnswers: null,
  testIndex: 0,
  testResults: null,
  registerData: null,
};

export function resetStudyState() {
  appState.studyQueue = null;
  appState.studyCards = null;
  appState.studyLanguage = '';
  appState.studyIndex = 0;
  appState.showTranslation = false;
  appState.studyCorrect = 0;
  appState.studyChecked = false;
  appState.studyTyped = '';
  appState.studyLastCorrect = false;
}

export function resetFlashState() {
  appState.flashCards = null;
  appState.flashQueue = null;
  appState.flashLanguage = '';
  appState.flashIndex = 0;
  appState.flashFlipped = false;
}

export function resetTestState() {
  appState.testQuestions = null;
  appState.testAnswers = null;
  appState.testIndex = 0;
  appState.testResults = null;
}
