import { getCurrentUser } from './auth-service';
import { getUserProfile } from './profile-service';

export const exploreOpportunities = async (router) => {
  const userResult = await getCurrentUser();
  if (!userResult.success) {
    return;
  }

  const profileResult = await getUserProfile(userResult.data.$id);
  if (profileResult.success && profileResult.data.hasCompletedSkillsInterests) {
    router.push('/TopMatches');
  } else {
    router.push('/Buildprofileskills');
  }
};
