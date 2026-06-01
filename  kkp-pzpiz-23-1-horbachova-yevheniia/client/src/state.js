export const appState = {
  screen: 'home',
  user: null,
  classId: null,
  wordSetId: null,
  assignmentId: null,
  studyQueue: null,
  studyCards: null,
  studyIndex: 0,
  showTranslation: false,
  reviewErrorsOnly: false,
  studyCorrect: 0,
  studyChecked: false,
  studyTyped: '',
  studyLastCorrect: false,
  testQuestions: null,
  testAnswers: null,
  testIndex: 0,
  testResults: null,
  registerData: null,
};

export function resetStudyState() {
  appState.studyQueue = null;
  appState.studyCards = null;
  appState.studyIndex = 0;
  appState.showTranslation = false;
  appState.reviewErrorsOnly = false;
  appState.studyCorrect = 0;
  appState.studyChecked = false;
  appState.studyTyped = '';
  appState.studyLastCorrect = false;
}

export function resetTestState() {
  appState.testQuestions = null;
  appState.testAnswers = null;
  appState.testIndex = 0;
  appState.testResults = null;
}
