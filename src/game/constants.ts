/** Размер кубика-игрока (сторона квадрата), px */
export const PLAYER_SIZE = 36;

/** Ширина и высота платформы по умолчанию, px */
export const PLATFORM_WIDTH = 140;
export const PLATFORM_HEIGHT = 18;

/** Вертикальный шаг между платформами, px */
export const PLATFORM_VERTICAL_GAP = 120;

/** Горизонтальное смещение соседних платформ, px */
export const PLATFORM_HORIZONTAL_STEP = 90;

/** Гравитация, px/s² */
export const GRAVITY = 2200;

/** Скорость прыжка вверх, px/s (отрицательная ось Y) */
export const JUMP_VELOCITY_Y = -720;

/** Горизонтальная скорость при прыжке на следующую платформу, px/s */
export const JUMP_VELOCITY_X = 280;

/** Очки за решённую платформу */
export const POINTS_PER_PLATFORM = 1;

/** Плавность камеры (0–1, чем больше — быстрее догоняет) */
export const CAMERA_FOLLOW_LERP = 0.12;

/** Отступ камеры от верха экрана до игрока, px */
export const CAMERA_PLAYER_OFFSET_Y = 220;

/** Допуск посадки на платформу, px */
export const LANDING_TOLERANCE = 6;

/** Небо: градиент */
export const COLOR_SKY_TOP = '#7ec8f0';
export const COLOR_SKY_BOTTOM = '#d4effc';

/** Платформы */
export const COLOR_PLATFORM = '#7a9eb5';
export const COLOR_PLATFORM_SOLVED = '#3daa6e';
export const COLOR_PLATFORM_ACTIVE = '#2a9fd6';

/** Игрок */
export const COLOR_PLAYER = '#f4c95d';
export const COLOR_PLAYER_JUMPING = '#e8a838';

/** HUD на canvas */
export const COLOR_HUD_TEXT = '#1e3a52';

/** Облака: параллакс от камеры */
export const CLOUD_PARALLAX_X = 0.06;
export const CLOUD_PARALLAX_Y = 0.1;
