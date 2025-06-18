import { getEmployees } from 'action/EmployeeAct'
import { QueryClient, useQuery } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { getAllOkrTab } from 'action/OKRTabAct';
import { getObjectivesTabs } from 'action/UserAct';
import { getKeyResultsSingle } from 'action/keyResultAct';
import { getTasks } from 'action/TasksAct';
import { AuthUserId, cascadeTabs } from 'utilities';
import { getAllNotificationsByUser } from 'action/NotificationAct';

const queryClient = new QueryClient();

export default function useGetEmployees() {
  const dispatch = useDispatch();
  const { data = [], error, isLoading } = useQuery(['employees'], () => dispatch(getEmployees()), {
    refetchOnWindowFocus: false,
    cacheTime: 1000 * 60 * 60,
    staleTime: 1000 * 60 * 60
  });
  return { data, error, isLoading };
}

export const removeQueries = () => {
  queryClient.invalidateQueries('employees');
}
export function useGetTasks() {
  const dispatch = useDispatch();
  const { data = [], error, isLoading } = useQuery(['tasks'], () => dispatch(getTasks()), {
    refetchOnWindowFocus: false,
  });
  return { data, error, isLoading };
}
export function useGetThresholds() {
  const dispatch = useDispatch();
  const { data = [], error, isLoading } = useQuery(['thresholds'], () => dispatch(getAllOkrTab()), {
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5
  });
  return { data, error, isLoading };
}


export function useGetObjectives(currentTab = cascadeTabs.Individual) {
  const dispatch = useDispatch();
  let user = localStorage.getItem("user") !== null ? JSON.parse(localStorage.getItem("user")) : null;
  let userData = localStorage.getItem("userData") !== null ? JSON.parse(localStorage.getItem("userData")) : null;
  const { data = [], error, isLoading, refetch, isRefetching } = useQuery(['objectives'], () => dispatch(getObjectivesTabs(user.role, userData.ownerId, currentTab)), {
    refetchOnWindowFocus: false,
  });
  return { data, error, isLoading: isLoading || isRefetching, refetch };
}

export function useGetKeyResultsSingle() {
  const dispatch = useDispatch();
  let userData = localStorage.getItem("userData") !== null ? JSON.parse(localStorage.getItem("userData")) : null;
  const { data = [], error, isLoading } = useQuery(['keyresults'], () => dispatch(getKeyResultsSingle(userData.ownerId)), {
    refetchOnWindowFocus: false,
  });
  return { data, error, isLoading };
}


export function useGetNotifications() {
  const dispatch = useDispatch();
  const { data = [], error, isLoading } = useQuery(['notifications'], () => dispatch(getAllNotificationsByUser(AuthUserId)), {
    refetchOnWindowFocus: false,
  });
  return { data, error, isLoading };
}