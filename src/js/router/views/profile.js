import { authGuard } from '../../utilities/authGuard';
import { initializeProfilePage } from '../../ui/profile/update';
import { onUpdateProfile } from '../../ui/profile/update';

authGuard();

initializeProfilePage();

document.getElementById('updateProfileForm').addEventListener('submit', (event) => {
  event.preventDefault();
  onUpdateProfile(event);
});
