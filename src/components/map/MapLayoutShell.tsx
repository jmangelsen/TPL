/**
 * MapLayoutShell.tsx
 * Full-screen layout: left nav rail + map canvas.
 * Sits at position:fixed so it fills the viewport regardless of parent layout.
 */

import React from 'react';
import { LeftNavRail } from './LeftNavRail';
import { InfrastructureMap } from './InfrastructureMap';

export function MapLayoutShell() {
  return (
    <div className="tpl-map-shell">
      <LeftNavRail />
      <div className="tpl-map-shell-canvas">
        <InfrastructureMap />
      </div>
    </div>
  );
}
