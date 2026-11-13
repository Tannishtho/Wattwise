import { useApp } from '../context/AppContext';

export function useBijliBaba() {
  const {
    babaMessages,
    activeBabaToast,
    settings,
    dismissBabaToast,
    triggerManualBabaTip,
    setBabaMood,
  } = useApp();

  return {
    messages: babaMessages,
    activeToast: activeBabaToast,
    mood: settings.babaMood,
    dismissToast: dismissBabaToast,
    requestTip: triggerManualBabaTip,
    setMood: setBabaMood,
  };
}
