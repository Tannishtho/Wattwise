import { BabaMessage, BabaMood, BabaTriggerEvent, NotificationSeverity } from '../types/notification';
import { getBabaDialogue } from '../data/bijliBabaDialogues';

class NotificationService {
  private cooldowns: Map<string, number> = new Map();
  private readonly COOLDOWN_DURATION_MS = 45000; // 45 seconds cooldown per event type

  /**
   * Dispatches a contextual Bijli Baba message if not throttled by cooldown
   */
  public triggerBabaEvent(
    event: BabaTriggerEvent,
    mood: BabaMood,
    applianceIdConcerned?: string,
    overrideCooldown: boolean = false
  ): BabaMessage | null {
    if (mood === 'SILENT') return null;

    const now = Date.now();
    const lastTriggered = this.cooldowns.get(event) || 0;

    // Check cooldown unless explicitly overridden (e.g. for user interactive clicks or critical errors)
    if (!overrideCooldown && now - lastTriggered < this.COOLDOWN_DURATION_MS) {
      return null;
    }

    const dialogue = getBabaDialogue(event, mood);
    if (!dialogue) return null;

    // Record cooldown timestamp
    this.cooldowns.set(event, now);

    let severity: NotificationSeverity = 'INFO';
    if (event === 'BUDGET_OVER_100' || event === 'FOURTH_APPLIANCE_REJECTED') {
      severity = 'CRITICAL';
    } else if (event === 'BUDGET_CRITICAL_90' || event === 'ALL_APPLIANCES_ON') {
      severity = 'WARNING';
    } else if (event === 'SAVINGS_ACTION_TAKEN' || event === 'NORMAL_POWER_RESTORED') {
      severity = 'SUCCESS';
    } else if (mood === 'ROAST') {
      severity = 'ROAST';
    }

    return {
      id: `baba-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      triggerEvent: event,
      mood,
      severity,
      headline: dialogue.headline,
      message: dialogue.message,
      timestamp: new Date().toISOString(),
      isRead: false,
      applianceIdConcerned,
    };
  }

  /**
   * Resets all cooldowns
   */
  public clearCooldowns() {
    this.cooldowns.clear();
  }
}

export const notificationService = new NotificationService();
