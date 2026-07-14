import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

const LUNCH_ID = "macrozone-lunch-reminder";
const DINNER_ID = "macrozone-dinner-reminder";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export const requestPermissions = async (): Promise<boolean> => {
  if (Platform.OS === "web") {
    return false;
  }

  const current = await Notifications.getPermissionsAsync();
  if (current.granted) {
    return true;
  }

  const requested = await Notifications.requestPermissionsAsync();
  return requested.status === "granted";
};

export const scheduleMealReminders = async (): Promise<boolean> => {
  if (Platform.OS === "web") {
    return false;
  }

  const granted = await requestPermissions();
  if (!granted) {
    return false;
  }

  await Notifications.cancelScheduledNotificationAsync(LUNCH_ID).catch(
    () => undefined,
  );
  await Notifications.cancelScheduledNotificationAsync(DINNER_ID).catch(
    () => undefined,
  );

  await Notifications.scheduleNotificationAsync({
    identifier: LUNCH_ID,
    content: {
      title: "MacroZone",
      body: "Don't forget to log your lunch!",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 12,
      minute: 0,
    },
  });

  await Notifications.scheduleNotificationAsync({
    identifier: DINNER_ID,
    content: {
      title: "MacroZone",
      body: "Time to log your dinner!",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 18,
      minute: 0,
    },
  });

  return true;
};

export const cancelMealReminders = async () => {
  if (Platform.OS === "web") {
    return;
  }

  await Notifications.cancelScheduledNotificationAsync(LUNCH_ID).catch(
    () => undefined,
  );
  await Notifications.cancelScheduledNotificationAsync(DINNER_ID).catch(
    () => undefined,
  );
};

export const syncMealReminders = async (enabled: boolean): Promise<boolean> => {
  if (!enabled) {
    await cancelMealReminders();
    return false;
  }

  return scheduleMealReminders();
};
