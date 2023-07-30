import axios from 'axios';
import { AUTH_URL, REGISTRATION_URL } from '../../config';
import { IIamService, LoginResponse } from '../interfaces/IIamService';

class IamService implements IIamService {
  async loginWithEmailPassword(email: string, password: string): Promise<LoginResponse> {
    const response = await axios.post<LoginResponse>(AUTH_URL, { email, password });
    return response.data;
  }

  async registerWithEmailPassword(email: string, password: string): Promise<void> {
    await axios.post(REGISTRATION_URL, { email, password });
  }
}

export default IamService;
