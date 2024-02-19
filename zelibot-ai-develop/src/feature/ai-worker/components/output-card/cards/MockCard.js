import { useEffect, useState, useRef } from 'react';
import OutputCard from "../OutputCard";

export default function MockCard({title}, ...rest) {
    const anchor = useRef(null);

    return (
		<OutputCard {...rest} title={title} isATSCard>
			<div ref={anchor} />
		</OutputCard>
	);
}