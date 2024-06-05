import Breadcrumbs from './breadcrumbs';
import { MobileSheet } from './mobile-sheet';
import { UserDropdown } from './user-dropdown';

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 py-2 sm:static sm:h-auto sm:bg-transparent sm:px-6">
      <MobileSheet />
      <Breadcrumbs />
      <div className="fmd:grow-0 relative ml-auto">
        <UserDropdown />
      </div>
    </header>
  );
}
