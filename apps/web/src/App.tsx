import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import LazyPage from './components/LazyPage';

const SelectPage = lazy(() => import('@/modules/select/SelectPage'));
const KaraokePage = lazy(() => import('@/modules/karaoke/KaraokePage'));
const LyricsPage = lazy(() => import('@/modules/lyrics/EditLyricsPage'));
const LyricsSyncPage = lazy(() => import('@/modules/lyrics/SyncPage'));

const App = () => {
  return (
    <Routes>
      <Route index element={<LazyPage key="index" component={SelectPage} />} />
      <Route
        path="/karaoke"
        element={<LazyPage key="karaoke" component={KaraokePage} />}
      />
      <Route path="/lyrics">
        <Route
          index
          element={<LazyPage key="lyrics-index" component={LyricsPage} />}
        />
        <Route
          path="sync"
          element={<LazyPage key="lyrics-sync" component={LyricsSyncPage} />}
        />
      </Route>
    </Routes>
  );
};

export default App;
