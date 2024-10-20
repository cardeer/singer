import { FC, LazyExoticComponent, Suspense } from 'react';

interface ILazyPageProps {
  component: LazyExoticComponent<FC>;
}

export const LazyPage: FC<ILazyPageProps> = ({ component: Component }) => {
  return (
    <Suspense fallback={null}>
      <Component />
    </Suspense>
  );
};

export default LazyPage;
