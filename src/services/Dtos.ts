/**
 * Data Transfer Objects (DTOs) for the API, generated from the OpenAPI schema.
 */

export type PaginatedDataListDto<T> = {
  count: number;
  next: string;
  previous: string;
  results: T[];
};

export type WorkoutViewDto = {
  id: number;
  name: string;
  creationDate: string;
  description: string;
};

export type WorkoutEditDto = {
  name: string;
  description: string;
};

export type UserProfileDto = {
  username: string;
  email: string;
  email_verified: boolean;
  is_trustworthy: boolean;
  date_joined: string;
  is_temporary: boolean;
  show_comments: boolean;
  show_english_ingredients: boolean;
  workout_reminder_active: boolean;
  workout_reminder: number;
  workout_duration: number;
  notification_language: number;
  age: number;
  birthdate: string;
  height: number;
  gender: string;
  sleep_hours: number;
  work_hours: number;
  work_intensity: string;
  sport_hours: number;
  sport_intensity: string;
  freetime_hours: number;
  freetime_intensity: string;
  calories: number;
  weight_unit: string;
  ro_access: boolean;
  num_days_weight_reminder: number;
};

export type TrainingDayViewDto = {
  id: number;
  training: number;
  description: string;
  day: number[];
};

export type TrainingDayEditDto = {
  training: number;
  description: string;
  day: number[];
};

export type SetViewDto = {
  id: number;
  exerciseday: number;
  sets: number;
  order: number;
  comment: string;
};

export type SetEditDto = {
  exerciseday: number;
  sets: number;
  order: number;
  comment: string;
};

export type SessionViewDto = {
  id: number;
  user: number;
  workout: number;
  date: string;
  notes: string;
  impression: string;
  time_start: string;
  time_end: string;
};

export type SessionEditDto = {
  workout: number;
  date: string;
  notes: string;
  impression: string;
  time_start: string;
  time_end: string;
};
