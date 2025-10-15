import * as React from "react";
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Card } from './card';
import '@testing-library/jest-dom';

describe('Card component', () => {
  it('renders title', () => {
    render(<Card title="Test Card" />);
    
    expect(screen.getByTitle('Test Card')).toBeInTheDocument();
  });
});
