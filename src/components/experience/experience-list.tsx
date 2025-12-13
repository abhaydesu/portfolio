import { type Experience } from '@/config/experience';
import React from 'react';

import { ExperienceCard } from './experience-card';

interface ExperienceListProps {
  experiences: Experience[];
}

export function ExperienceList({ experiences }: ExperienceListProps) {
  if (experiences.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No work experiences found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {experiences.map((experience: Experience) => (
        <ExperienceCard key={experience.company} experience={experience} />
      ))}
    </div>
  );
}