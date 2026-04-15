export interface Driver {
  id: number;
  code: string;
  firstName: string;
  lastName: string;
  number: number;
  team: string;
  teamColor: string;
  country: string;
  countryFlag: string;
}

export const drivers: Driver[] = [
  { id: 1, code: 'VER', firstName: 'Max', lastName: 'Verstappen', number: 1, team: 'Red Bull Racing', teamColor: '#3671C6', country: 'NED', countryFlag: '🇳🇱' },
  { id: 2, code: 'PER', firstName: 'Sergio', lastName: 'Pérez', number: 11, team: 'Red Bull Racing', teamColor: '#3671C6', country: 'MEX', countryFlag: '🇲🇽' },
  { id: 3, code: 'LEC', firstName: 'Charles', lastName: 'Leclerc', number: 16, team: 'Ferrari', teamColor: '#E8002D', country: 'MON', countryFlag: '🇲🇨' },
  { id: 4, code: 'SAI', firstName: 'Carlos', lastName: 'Sainz', number: 55, team: 'Ferrari', teamColor: '#E8002D', country: 'ESP', countryFlag: '🇪🇸' },
  { id: 5, code: 'NOR', firstName: 'Lando', lastName: 'Norris', number: 4, team: 'McLaren', teamColor: '#FF8000', country: 'GBR', countryFlag: '🇬🇧' },
  { id: 6, code: 'PIA', firstName: 'Oscar', lastName: 'Piastri', number: 81, team: 'McLaren', teamColor: '#FF8000', country: 'AUS', countryFlag: '🇦🇺' },
  { id: 7, code: 'HAM', firstName: 'Lewis', lastName: 'Hamilton', number: 44, team: 'Mercedes', teamColor: '#27F4D2', country: 'GBR', countryFlag: '🇬🇧' },
  { id: 8, code: 'RUS', firstName: 'George', lastName: 'Russell', number: 63, team: 'Mercedes', teamColor: '#27F4D2', country: 'GBR', countryFlag: '🇬🇧' },
  { id: 9, code: 'ALO', firstName: 'Fernando', lastName: 'Alonso', number: 14, team: 'Aston Martin', teamColor: '#229971', country: 'ESP', countryFlag: '🇪🇸' },
  { id: 10, code: 'STR', firstName: 'Lance', lastName: 'Stroll', number: 18, team: 'Aston Martin', teamColor: '#229971', country: 'CAN', countryFlag: '🇨🇦' },
  { id: 11, code: 'GAS', firstName: 'Pierre', lastName: 'Gasly', number: 10, team: 'Alpine', teamColor: '#0093CC', country: 'FRA', countryFlag: '🇫🇷' },
  { id: 12, code: 'OCO', firstName: 'Esteban', lastName: 'Ocon', number: 31, team: 'Alpine', teamColor: '#0093CC', country: 'FRA', countryFlag: '🇫🇷' },
  { id: 13, code: 'TSU', firstName: 'Yuki', lastName: 'Tsunoda', number: 22, team: 'AlphaTauri', teamColor: '#6692FF', country: 'JPN', countryFlag: '🇯🇵' },
  { id: 14, code: 'RIC', firstName: 'Daniel', lastName: 'Ricciardo', number: 3, team: 'AlphaTauri', teamColor: '#6692FF', country: 'AUS', countryFlag: '🇦🇺' },
  { id: 15, code: 'BOT', firstName: 'Valtteri', lastName: 'Bottas', number: 77, team: 'Sauber', teamColor: '#52E252', country: 'FIN', countryFlag: '🇫🇮' },
  { id: 16, code: 'ZHO', firstName: 'Zhou', lastName: 'Guanyu', number: 24, team: 'Sauber', teamColor: '#52E252', country: 'CHN', countryFlag: '🇨🇳' },
  { id: 17, code: 'MAG', firstName: 'Kevin', lastName: 'Magnussen', number: 20, team: 'Haas', teamColor: '#B6BABD', country: 'DEN', countryFlag: '🇩🇰' },
  { id: 18, code: 'HUL', firstName: 'Nico', lastName: 'Hülkenberg', number: 27, team: 'Haas', teamColor: '#B6BABD', country: 'GER', countryFlag: '🇩🇪' },
  { id: 19, code: 'ALB', firstName: 'Alexander', lastName: 'Albon', number: 23, team: 'Williams', teamColor: '#64C4FF', country: 'THA', countryFlag: '🇹🇭' },
  { id: 20, code: 'SAR', firstName: 'Logan', lastName: 'Sargeant', number: 2, team: 'Williams', teamColor: '#64C4FF', country: 'USA', countryFlag: '🇺🇸' },
];

export const getDriverByCode = (code: string): Driver | undefined =>
  drivers.find(d => d.code === code);

export const getTeamColor = (team: string): string => {
  const d = drivers.find(dr => dr.team === team);
  return d?.teamColor || '#FFFFFF';
};
