import { useState, useEffect } from 'react';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../firebase';
import { BuildoutEvent, buildoutEvents as staticBuildoutEvents } from '../lib/buildoutTrackerData';

let cachedEvents: BuildoutEvent[] | null = null;
console.log("useBuildoutEvents module loaded, cachedEvents:", cachedEvents);

export const useBuildoutEvents = () => {
  console.log("useBuildoutEvents hook called, cachedEvents:", cachedEvents);
  const [events, setEvents] = useState<BuildoutEvent[]>(cachedEvents || []);
  const [loading, setLoading] = useState(cachedEvents === null);

  useEffect(() => {
    console.log("useBuildoutEvents useEffect, cachedEvents:", cachedEvents);
    if (cachedEvents) return;

    const fetchData = async () => {
      try {
        const q = query(collection(db, 'buildout_events'));
        const snapshot = await getDocs(q);
        if (snapshot.size > 0) {
          const fetchedEvents: BuildoutEvent[] = [];
          snapshot.forEach((doc) => {
            fetchedEvents.push({ id: doc.id, ...doc.data() } as BuildoutEvent);
          });
          cachedEvents = fetchedEvents;
          setEvents(fetchedEvents);
        } else {
          cachedEvents = staticBuildoutEvents;
          setEvents(staticBuildoutEvents);
        }
      } catch (error) {
        console.error("Error fetching buildout events, using static data:", error);
        cachedEvents = staticBuildoutEvents;
        setEvents(staticBuildoutEvents);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { events, loading };
};
