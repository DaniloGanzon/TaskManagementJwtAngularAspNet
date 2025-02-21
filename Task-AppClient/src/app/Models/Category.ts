

export type Category = 'Work' | 'School' | 'House' | 'Personal' | 'Shopping' | 'Others';

export const categoryColors: { [key in Category]: string } = {
  Work: 'linear-gradient(to right, #FFB6C1, #FF69B4)',  // Light Pink to Deep Pink
  School: 'linear-gradient(to right, #87CEFA, #4682B4)', // Light Sky Blue to Steel Blue
  House: 'linear-gradient(to right, #98FB98, #32CD32)',  // Pale Green to Lime Green
  Personal: 'linear-gradient(to right, #FF6347, #FF4500)', // Tomato to Orange Red
  Shopping: 'linear-gradient(to right, #FFD700, #FFA500)', // Gold to Orange
  Others: 'linear-gradient(to right, #D3D3D3, #A9A9A9)'   // Light Gray to Dark Gray
};

export const textColors: { [key in Category]: string } = {
  Work: 'white',
  School: 'black',
  House: 'black',
  Personal: 'white',
  Shopping: 'white',
  Others: 'black'
};

// Fallback for unknown categories
export const defaultCategoryColor = 'linear-gradient(to right, #D3D3D3, #A9A9A9)';
export const defaultTextColor = 'black';
