import { AUTH_URL, REGISTRATION_URL } from '../../config';
import { IIamService, LoginResponse } from '../interfaces/IIamService';

class IamService implements IIamService {
  async loginWithEmailPassword(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(AUTH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return (await response.json()) as LoginResponse;
  }

  async registerWithEmailPassword(email: string, password: string): Promise<void> {
    const response = await fetch(REGISTRATION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
  }
}

export default IamService;
