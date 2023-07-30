import { observer } from 'mobx-react-lite';
import DashboardLayoutComponent from './DashboardLayout';

interface DashboardControllerProps {
  children: React.ReactNode;
}

function DashboardLayoutController(props: DashboardControllerProps): JSX.Element {
  const { children } = props;

  return <DashboardLayoutComponent>{children}</DashboardLayoutComponent>;
}

const DashboardLayout = observer(DashboardLayoutController);

export default DashboardLayout;
