import { observer } from 'mobx-react-lite';
import { useRecoilValue } from 'recoil';

import DashboardLayoutComponent from './TodoLayout';
import { useIamViewModel } from '../../view-models/IamViewModel';
import { userState } from '../../state/auth';

interface DashboardControllerProps {
  children: React.ReactNode;
}

function DashboardLayoutController(props: DashboardControllerProps): JSX.Element {
  const { children } = props;
  const iamViewModel = useIamViewModel();
  const { authMessage, logout } = iamViewModel;
  const user = useRecoilValue(userState);

  return (
    <DashboardLayoutComponent
      errorMessage={authMessage?.type === 'error' ? authMessage?.message : ''}
      user={user}
      logout={logout}
    >
      {children}
    </DashboardLayoutComponent>
  );
}

const DashboardLayout = observer(DashboardLayoutController);

export default DashboardLayout;
