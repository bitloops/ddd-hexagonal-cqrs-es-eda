import { observer } from 'mobx-react-lite';
import DashboardLayoutComponent from './DashboardLayout';
import { useIamViewModel } from '../../view-models/IamViewModel';

interface DashboardControllerProps {
  children: React.ReactNode;
}

function DashboardLayoutController(props: DashboardControllerProps): JSX.Element {
  const { children } = props;
  const iamViewModel = useIamViewModel();
  const { authMessage, user, logout } = iamViewModel;

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
