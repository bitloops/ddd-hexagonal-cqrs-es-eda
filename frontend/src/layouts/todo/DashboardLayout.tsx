import * as React from 'react';

interface IDashboardLayout {
  // open: boolean;
  // setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  // pageName: string | undefined;
  children: React.ReactNode;
}

function DashboardLayout(props: IDashboardLayout): JSX.Element {
  const { children } = props;

  // const toggleDrawer = () => {
  //   setOpen(!open);
  // };
  // const openDrawer = () => {
  //   setOpen(true);
  // };

  return (
    <div>
      This is the layout
      {children}
    </div>
  );
}

export default DashboardLayout;
