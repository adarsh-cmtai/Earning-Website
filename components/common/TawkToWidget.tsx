"use client";

import { useEffect } from 'react';

declare global {
  interface Window {
    Tawk_API: any;
  }
}

export function TawkToWidget() {
  useEffect(() => {
    var Tawk_API = window.Tawk_API || {}, Tawk_LoadStart = new Date();
    (function(){
      var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
      s1.async = true;
      s1.src = 'https://embed.tawk.to/68889b40d7b32c19242c77c9/1j1apstmd';
      s1.charset = 'UTF-8';
      s1.setAttribute('crossorigin','*');
      s0.parentNode?.insertBefore(s1,s0);
    })();
  }, []);

  return null;
}