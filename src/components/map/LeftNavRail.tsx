/**
 * LeftNavRail.tsx
 * Icon-based collapsible left nav for the full-screen map page.
 * Expands on hover to reveal labels, collapses back on mouse leave.
 */

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Map, Globe, BookOpen, Activity } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/',                  icon: Home,     label: 'Home'         },
  { to: '/map',               icon: Map,      label: 'Atlas'        },
  { to: '/ground-truth',      icon: Globe,    label: 'Ground Truth' },
  { to: '/constraint-atlas',  icon: Activity, label: 'Constraints'  },
  { to: '/research',          icon: BookOpen, label: 'Research'     },
];

export function LeftNavRail() {
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();

  return (
    <nav
      className="tpl-left-rail"
      style={{ width: expanded ? 200 : 56 }}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {/* Nav links */}
      <div className="tpl-rail-links" style={{ marginTop: 24 }}>
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));
          return (
            <Link
              key={to}
              to={to}
              className={`tpl-rail-link ${active ? 'tpl-rail-link--active' : ''}`}
              title={label}
            >
              <Icon size={18} className="tpl-rail-link-icon" />
              {expanded && <span className="tpl-rail-link-label">{label}</span>}
            </Link>
          );
        })}
      </div>

      {/* Bottom: coordinates display placeholder */}
      <div className="tpl-rail-bottom">
        {expanded && (
          <span className="tpl-rail-build-tag">BETA</span>
        )}
      </div>
    </nav>
  );
}
