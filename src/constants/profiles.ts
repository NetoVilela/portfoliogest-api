type ProfileType = {
  id: number;
  name: string;
};

const PROFILES: ProfileType[] = [
  {
    id: 1,
    name: 'Administrador',
  },
  {
    id: 2,
    name: 'Colaborador',
  },
];

export default function getProfile(profileId: number) {
  const foundProfile = PROFILES.find(
    (profile: ProfileType) => profile.id === profileId,
  );

  return foundProfile ? foundProfile.name : 'Profile not found';
}
