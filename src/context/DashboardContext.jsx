import { createContext, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { getMockData } from "../services/mockDataService";
import { createDashboardData } from "../utils/dashboardMetrics";

const DashboardContext = createContext(null);

export function DashboardProvider({ children }) {
  const [appData] = useState(() => getMockData());
  const dashboard = useMemo(() => createDashboardData(appData), [appData]);

  return (
    <DashboardContext.Provider value={{ appData, dashboard }}>
      {children}
    </DashboardContext.Provider>
  );
}

DashboardProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { DashboardContext };
