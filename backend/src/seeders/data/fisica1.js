// Contenido de Física 1 (FIS1): mecánica clásica. Se usa g = 9.8 m/s².
// Temario estándar de mecánica; ajustar a las semanas del sílabo oficial de UTEC si difiere.

export const fisica1 = [
  {
    name: "Semana 1: Magnitudes, Unidades y Vectores",
    desc: "Sistema Internacional, conversión de unidades y operaciones con vectores.",
    content: String.raw`**Sistema Internacional (SI):** longitud en metros (m), masa en kilogramos (kg) y tiempo en segundos (s).

**Conversión de unidades:** multiplica por factores iguales a 1.
Ejemplo: $72\ \text{km/h} \cdot \frac{1000\ \text{m}}{1\ \text{km}} \cdot \frac{1\ \text{h}}{3600\ \text{s}} = 20\ \text{m/s}$.

**Escalares vs. vectores:** la masa y el tiempo son escalares; la velocidad, la fuerza y el desplazamiento son vectores (tienen magnitud y dirección).

**Componentes:** un vector de magnitud $A$ y ángulo $\theta$ respecto al eje $x$:
$$A_x = A\cos\theta, \quad A_y = A\sin\theta, \quad |A| = \sqrt{A_x^2 + A_y^2}$$`,
    quiz: {
      title: "Evaluación: Magnitudes y Vectores",
      qs: [
        { q: "¿A cuántos m/s equivalen 72 km/h?", opts: ["7.2 m/s", "20 m/s", "36 m/s", "259 m/s"], ans: 1, exp: "72·1000/3600 = 20 m/s." },
        { q: "¿Cuál de estas magnitudes es vectorial?", opts: ["Masa", "Temperatura", "Fuerza", "Tiempo"], ans: 2, exp: "La fuerza tiene magnitud y dirección." },
        { q: "Un vector de 10 N forma 30° con el eje x. ¿Cuál es su componente x?", opts: ["5 N", "8.66 N", "10 N", "6 N"], ans: 1, exp: "Aₓ = 10·cos 30° ≈ 8.66 N." },
        { q: "¿Cuál es la magnitud del vector (6, 8) m?", opts: ["14 m", "10 m", "48 m", "2 m"], ans: 1, exp: "√(36 + 64) = √100 = 10 m." },
      ],
    },
  },
  {
    name: "Semana 2: Cinemática en 1D (MRU y MRUV)",
    desc: "Posición, velocidad, aceleración y ecuaciones del movimiento.",
    content: String.raw`**MRU (velocidad constante):** $x = x_0 + v t$.

**MRUV (aceleración constante):**
$$v = v_0 + a t \qquad x = x_0 + v_0 t + \tfrac{1}{2} a t^2 \qquad v^2 = v_0^2 + 2a\,\Delta x$$

**Gráficas:**
- La pendiente de $x(t)$ es la velocidad.
- La pendiente de $v(t)$ es la aceleración y el **área bajo** $v(t)$ es el desplazamiento.

**Ejemplo:** un auto parte del reposo con $a = 2\ \text{m/s}^2$. A los 5 s: $v = 10\ \text{m/s}$ y $x = \frac{1}{2}(2)(25) = 25\ \text{m}$.`,
    quiz: {
      title: "Evaluación: MRU y MRUV",
      qs: [
        { q: "Un auto parte del reposo con a = 2 m/s². ¿Qué distancia recorre en 5 s?", opts: ["10 m", "25 m", "50 m", "5 m"], ans: 1, exp: "x = ½·2·5² = 25 m." },
        { q: "En una gráfica v(t), el área bajo la curva representa:", opts: ["La aceleración", "El desplazamiento", "La fuerza", "La rapidez media"], ans: 1, exp: "Integrar la velocidad en el tiempo da el desplazamiento." },
        { q: "Un móvil va a 20 m/s y frena con a = −4 m/s². ¿En qué distancia se detiene?", opts: ["25 m", "50 m", "80 m", "5 m"], ans: 1, exp: "0 = 20² + 2(−4)Δx → Δx = 400/8 = 50 m." },
        { q: "¿Qué indica una gráfica x(t) que es una recta inclinada?", opts: ["Reposo", "MRU", "MRUV", "Caída libre"], ans: 1, exp: "Pendiente constante significa velocidad constante." },
      ],
    },
  },
  {
    name: "Semana 3: Caída Libre",
    desc: "Movimiento vertical bajo la gravedad.",
    content: String.raw`La caída libre es un MRUV con $a = -g = -9.8\ \text{m/s}^2$ (tomando como positivo hacia arriba).
$$y = y_0 + v_0 t - \tfrac{1}{2} g t^2 \qquad v = v_0 - g t$$

**Lanzamiento hacia arriba:**
- En la altura máxima, $v = 0$.
- Tiempo de subida: $t_s = \frac{v_0}{g}$. Altura máxima: $h = \frac{v_0^2}{2g}$.
- Sin aire, el tiempo de subida es igual al de bajada.

**Ejemplo:** si lanzas una pelota a 19.6 m/s, sube durante 2 s y alcanza $h = \frac{19.6^2}{19.6} = 19.6$ m.`,
    quiz: {
      title: "Evaluación: Caída Libre",
      qs: [
        { q: "Una pelota se lanza hacia arriba a 19.6 m/s. ¿Cuánto tarda en llegar a su altura máxima?", opts: ["1 s", "2 s", "4 s", "19.6 s"], ans: 1, exp: "t = v₀/g = 19.6/9.8 = 2 s." },
        { q: "¿Cuál es la velocidad en el punto más alto?", opts: ["Máxima", "Cero", "Igual a v₀", "−g"], ans: 1, exp: "En la altura máxima la velocidad vertical se anula." },
        { q: "Se deja caer una piedra desde el reposo. ¿Qué velocidad tiene a los 3 s?", opts: ["9.8 m/s", "29.4 m/s", "44.1 m/s", "3 m/s"], ans: 1, exp: "v = g·t = 9.8·3 = 29.4 m/s (hacia abajo)." },
        { q: "¿Cuál es la aceleración de un objeto en caída libre en su punto más alto?", opts: ["0", "9.8 m/s² hacia abajo", "9.8 m/s² hacia arriba", "Depende de la masa"], ans: 1, exp: "La gravedad actúa siempre, incluso cuando v = 0." },
      ],
    },
  },
  {
    name: "Semana 4: Movimiento de Proyectiles",
    desc: "Movimiento en 2D: componentes horizontal y vertical.",
    content: String.raw`Un proyectil combina dos movimientos **independientes**:
- **Horizontal:** MRU, $x = v_0\cos\theta \cdot t$.
- **Vertical:** caída libre, $y = v_0\sin\theta \cdot t - \frac{1}{2} g t^2$.

**Fórmulas útiles (mismo nivel de salida y llegada):**
$$t_{vuelo} = \frac{2 v_0 \sin\theta}{g} \qquad R = \frac{v_0^2 \sin(2\theta)}{g} \qquad H = \frac{(v_0\sin\theta)^2}{2g}$$

**El alcance máximo** se logra con $\theta = 45^\circ$. Ángulos complementarios (30° y 60°) dan el mismo alcance.

**Lanzamiento horizontal** desde una altura $h$: el tiempo de caída es $t = \sqrt{2h/g}$, sin importar la velocidad horizontal.`,
    quiz: {
      title: "Evaluación: Proyectiles",
      qs: [
        { q: "¿Con qué ángulo se obtiene el alcance máximo (sin aire)?", opts: ["30°", "45°", "60°", "90°"], ans: 1, exp: "R es máximo cuando sin(2θ) = 1, es decir, θ = 45°." },
        { q: "En el movimiento de un proyectil, la velocidad horizontal:", opts: ["Aumenta", "Disminuye", "Permanece constante", "Se anula en la cima"], ans: 2, exp: "No hay aceleración horizontal (sin aire)." },
        { q: "Una bola rueda de una mesa de 1.225 m de alto. ¿Cuánto tarda en caer?", opts: ["0.25 s", "0.5 s", "1 s", "1.225 s"], ans: 1, exp: "t = √(2·1.225/9.8) = √0.25 = 0.5 s." },
        { q: "Si un proyectil lanzado a 30° tiene alcance R, ¿qué alcance tiene a 60° con la misma rapidez?", opts: ["R/2", "R", "2R", "√3·R"], ans: 1, exp: "sin(60°) = sin(120°): los ángulos complementarios dan el mismo alcance." },
      ],
    },
  },
  {
    name: "Semana 5: Movimiento Circular",
    desc: "MCU, velocidad angular y aceleración centrípeta.",
    content: String.raw`**Magnitudes angulares:**
- Velocidad angular: $\omega = \frac{\Delta\theta}{\Delta t}$ (rad/s).
- Periodo $T$ y frecuencia $f$: $\omega = \frac{2\pi}{T} = 2\pi f$.
- Relación lineal-angular: $v = \omega r$.

**Aceleración centrípeta:** en el MCU la rapidez es constante, pero la dirección cambia; por eso hay aceleración hacia el centro:
$$a_c = \frac{v^2}{r} = \omega^2 r$$

**Ejemplo:** una rueda de 0.5 m de radio gira a 4 rad/s. Un punto del borde tiene $v = 2$ m/s y $a_c = 8\ \text{m/s}^2$.`,
    quiz: {
      title: "Evaluación: Movimiento Circular",
      qs: [
        { q: "Una rueda de 0.5 m de radio gira a 4 rad/s. ¿Qué rapidez tiene un punto del borde?", opts: ["2 m/s", "8 m/s", "0.125 m/s", "4.5 m/s"], ans: 0, exp: "v = ω·r = 4·0.5 = 2 m/s." },
        { q: "En el MCU, ¿hacia dónde apunta la aceleración?", opts: ["Tangente a la trayectoria", "Hacia el centro", "Hacia afuera", "No hay aceleración"], ans: 1, exp: "Es la aceleración centrípeta: cambia la dirección de la velocidad." },
        { q: "Un auto toma una curva de 50 m de radio a 10 m/s. ¿Cuál es su aceleración centrípeta?", opts: ["0.2 m/s²", "2 m/s²", "5 m/s²", "500 m/s²"], ans: 1, exp: "a = v²/r = 100/50 = 2 m/s²." },
        { q: "Si el periodo es 2 s, ¿cuánto vale ω?", opts: ["π rad/s", "2π rad/s", "4π rad/s", "0.5 rad/s"], ans: 0, exp: "ω = 2π/T = 2π/2 = π rad/s." },
      ],
    },
  },
  {
    name: "Semana 6: Leyes de Newton",
    desc: "Inercia, F = ma, acción-reacción y diagramas de cuerpo libre.",
    content: String.raw`**Primera ley (inercia):** si la fuerza neta es cero, el cuerpo mantiene su velocidad (reposo o MRU).

**Segunda ley:** $\sum \vec{F} = m\vec{a}$.

**Tercera ley:** a toda acción corresponde una reacción igual y opuesta, **aplicada sobre el otro cuerpo** (por eso no se cancelan).

**Diagrama de cuerpo libre (DCL), pasos:**
1. Aísla el cuerpo.
2. Dibuja todas las fuerzas: peso $mg$, normal $N$, tensión $T$, fricción $f$.
3. Elige ejes y aplica $\sum F_x = ma_x$, $\sum F_y = ma_y$.

**Ejemplo:** para un bloque de 5 kg empujado con 20 N sin fricción, $a = 4\ \text{m/s}^2$.`,
    quiz: {
      title: "Evaluación: Leyes de Newton",
      qs: [
        { q: "Un bloque de 5 kg se empuja con 20 N sin fricción. ¿Cuál es su aceleración?", opts: ["100 m/s²", "4 m/s²", "0.25 m/s²", "15 m/s²"], ans: 1, exp: "a = F/m = 20/5 = 4 m/s²." },
        { q: "¿Por qué la acción y la reacción no se cancelan?", opts: ["Porque tienen distinta magnitud", "Porque actúan sobre cuerpos distintos", "Porque una es mayor", "Sí se cancelan"], ans: 1, exp: "Cada una actúa sobre un cuerpo diferente." },
        { q: "Un cuerpo se mueve con velocidad constante. ¿Cuál es la fuerza neta sobre él?", opts: ["Igual a su peso", "Cero", "Igual a m·v", "Depende de la velocidad"], ans: 1, exp: "Primera ley: sin aceleración, la fuerza neta es nula." },
        { q: "¿Cuánto pesa una masa de 10 kg en la Tierra?", opts: ["10 N", "98 N", "9.8 N", "980 N"], ans: 1, exp: "P = m·g = 10·9.8 = 98 N." },
      ],
    },
  },
  {
    name: "Semana 7: Fricción y Planos Inclinados",
    desc: "Fricción estática y cinética; descomposición del peso.",
    content: String.raw`**Fricción:**
- Cinética: $f_k = \mu_k N$ (cuando hay deslizamiento).
- Estática: $f_s \le \mu_s N$ (impide el movimiento hasta un máximo).

**Plano inclinado de ángulo $\theta$:** descompón el peso en ejes paralelo y perpendicular al plano:
$$W_\parallel = mg\sin\theta \qquad W_\perp = mg\cos\theta \qquad N = mg\cos\theta$$

**Sin fricción**, la aceleración de bajada es $a = g\sin\theta$.
**Con fricción cinética:** $a = g(\sin\theta - \mu_k\cos\theta)$.

**Condición de reposo a punto de deslizar:** $\tan\theta = \mu_s$.`,
    quiz: {
      title: "Evaluación: Fricción y Planos Inclinados",
      qs: [
        { q: "Un bloque baja por un plano de 30° sin fricción. ¿Cuál es su aceleración?", opts: ["9.8 m/s²", "4.9 m/s²", "8.5 m/s²", "0"], ans: 1, exp: "a = g·sin 30° = 9.8·0.5 = 4.9 m/s²." },
        { q: "En un plano inclinado sin otras fuerzas perpendiculares, la normal vale:", opts: ["mg", "mg·sin θ", "mg·cos θ", "mg·tan θ"], ans: 2, exp: "N equilibra la componente perpendicular del peso." },
        { q: "Un bloque de 10 kg desliza en el piso con μk = 0.2. ¿Cuál es la fricción?", opts: ["2 N", "19.6 N", "98 N", "49 N"], ans: 1, exp: "f = μ·N = 0.2·98 = 19.6 N." },
        { q: "Un bloque está a punto de deslizar a 37° (tan 37° ≈ 0.75). ¿Cuánto vale μs?", opts: ["0.6", "0.75", "0.8", "1.33"], ans: 1, exp: "En el límite se cumple tan θ = μs." },
      ],
    },
  },
  {
    name: "Semana 8: Dinámica del Movimiento Circular",
    desc: "Fuerza centrípeta en curvas, cuerdas y peraltes.",
    content: String.raw`En un movimiento circular, la **fuerza neta hacia el centro** es:
$$F_c = m\frac{v^2}{r}$$
La fuerza centrípeta **no es una fuerza nueva**: la proporcionan la tensión, la fricción, la normal o el peso.

**Casos típicos:**
- **Auto en curva plana:** la fricción estática da la fuerza centrípeta: $\mu_s mg = \frac{mv^2}{r} \Rightarrow v_{max} = \sqrt{\mu_s g r}$.
- **Piedra atada a una cuerda (horizontal):** $T = \frac{mv^2}{r}$.
- **Punto más alto de un rizo:** la velocidad mínima cumple $mg = \frac{mv^2}{r} \Rightarrow v_{min} = \sqrt{gr}$.`,
    quiz: {
      title: "Evaluación: Dinámica Circular",
      qs: [
        { q: "Una piedra de 0.5 kg gira con una cuerda de 1 m a 4 m/s (horizontal). ¿Cuál es la tensión?", opts: ["2 N", "8 N", "4 N", "16 N"], ans: 1, exp: "T = m·v²/r = 0.5·16/1 = 8 N." },
        { q: "En una curva plana, ¿qué fuerza provee la fuerza centrípeta del auto?", opts: ["El peso", "La normal", "La fricción estática", "La fuerza del motor"], ans: 2, exp: "La fricción entre las llantas y la pista apunta hacia el centro." },
        { q: "¿Cuál es la velocidad mínima en la parte alta de un rizo de radio 2.5 m?", opts: ["≈ 2.5 m/s", "≈ 4.9 m/s", "≈ 24.5 m/s", "≈ 9.8 m/s"], ans: 1, exp: "v = √(g·r) = √(24.5) ≈ 4.95 m/s." },
        { q: "Si se duplica la velocidad en una curva, la fuerza centrípeta necesaria:", opts: ["Se duplica", "Se cuadruplica", "Se mantiene", "Se reduce a la mitad"], ans: 1, exp: "Fc es proporcional a v²." },
      ],
    },
  },
  {
    name: "Semana 9: Trabajo y Energía Cinética",
    desc: "Trabajo de una fuerza y teorema trabajo-energía.",
    content: String.raw`**Trabajo** de una fuerza constante: $W = F\,d\cos\theta$ (en joules, J).
- Si la fuerza es perpendicular al movimiento (por ejemplo, la normal), $W = 0$.
- La fricción hace trabajo **negativo**.

**Energía cinética:** $K = \frac{1}{2}mv^2$.

**Teorema trabajo-energía:** el trabajo neto cambia la energía cinética:
$$W_{neto} = \Delta K = \tfrac{1}{2}mv_f^2 - \tfrac{1}{2}mv_i^2$$

**Ejemplo:** para acelerar un auto de 1000 kg de 0 a 20 m/s se necesita $W = \frac{1}{2}(1000)(400) = 200\,000$ J.`,
    quiz: {
      title: "Evaluación: Trabajo y Energía Cinética",
      qs: [
        { q: "Se empuja una caja con 50 N a lo largo de 4 m, en la dirección del movimiento. ¿Qué trabajo se realiza?", opts: ["12.5 J", "200 J", "54 J", "0 J"], ans: 1, exp: "W = F·d = 50·4 = 200 J." },
        { q: "¿Qué trabajo realiza la fuerza normal sobre un bloque que se desliza en el piso?", opts: ["Positivo", "Negativo", "Cero", "Igual al peso"], ans: 2, exp: "La normal es perpendicular al desplazamiento: cos 90° = 0." },
        { q: "¿Qué energía cinética tiene un cuerpo de 2 kg a 3 m/s?", opts: ["6 J", "9 J", "18 J", "3 J"], ans: 1, exp: "K = ½·2·3² = 9 J." },
        { q: "Si la velocidad de un cuerpo se duplica, su energía cinética:", opts: ["Se duplica", "Se cuadruplica", "No cambia", "Se reduce a la mitad"], ans: 1, exp: "K es proporcional a v²." },
      ],
    },
  },
  {
    name: "Semana 10: Energía Potencial y Conservación",
    desc: "Energía potencial gravitatoria y elástica; conservación de la energía.",
    content: String.raw`**Energía potencial gravitatoria:** $U_g = mgh$.
**Energía potencial elástica:** $U_e = \frac{1}{2}kx^2$.

**Conservación de la energía mecánica** (solo fuerzas conservativas):
$$K_i + U_i = K_f + U_f$$

**Con fricción:** $E_i = E_f + |W_{fricción}|$ (parte de la energía se disipa como calor).

**Ejemplo:** un objeto que cae desde 5 m sin fricción llega al suelo con
$v = \sqrt{2gh} = \sqrt{2(9.8)(5)} \approx 9.9\ \text{m/s}$, sin importar su masa.`,
    quiz: {
      title: "Evaluación: Conservación de la Energía",
      qs: [
        { q: "Un objeto se deja caer desde 5 m. ¿Con qué rapidez llega al suelo (sin aire)?", opts: ["≈ 4.9 m/s", "≈ 9.9 m/s", "≈ 49 m/s", "≈ 98 m/s"], ans: 1, exp: "v = √(2gh) = √98 ≈ 9.9 m/s." },
        { q: "Un resorte de k = 200 N/m se comprime 0.1 m. ¿Cuánta energía almacena?", opts: ["1 J", "2 J", "10 J", "20 J"], ans: 0, exp: "U = ½·200·0.1² = 1 J." },
        { q: "¿Cuándo se conserva la energía mecánica?", opts: ["Siempre", "Cuando solo actúan fuerzas conservativas", "Cuando hay fricción", "Solo en reposo"], ans: 1, exp: "Las fuerzas no conservativas, como la fricción, disipan energía." },
        { q: "¿Qué energía potencial tiene una masa de 2 kg a 10 m de altura?", opts: ["20 J", "196 J", "98 J", "200 J"], ans: 1, exp: "U = m·g·h = 2·9.8·10 = 196 J." },
      ],
    },
  },
  {
    name: "Semana 11: Potencia",
    desc: "Rapidez con que se realiza trabajo y eficiencia.",
    content: String.raw`**Potencia media:** $P = \frac{W}{t}$ (watts, W = J/s).
**Potencia instantánea** con fuerza constante: $P = F\,v$.

**Eficiencia:** $\eta = \frac{P_{útil}}{P_{entregada}} \times 100\%$.

**Unidades:** $1\ \text{hp} \approx 746\ \text{W}$; $1\ \text{kWh} = 3.6 \times 10^6\ \text{J}$.

**Ejemplo:** subir una masa de 50 kg a 10 m en 5 s requiere
$P = \frac{mgh}{t} = \frac{50(9.8)(10)}{5} = 980\ \text{W}$.`,
    quiz: {
      title: "Evaluación: Potencia",
      qs: [
        { q: "Se levantan 50 kg a 10 m en 5 s. ¿Qué potencia se requiere?", opts: ["98 W", "490 W", "980 W", "4900 W"], ans: 2, exp: "P = mgh/t = 4900/5 = 980 W." },
        { q: "Un motor entrega 1000 W y su potencia útil es 800 W. ¿Cuál es su eficiencia?", opts: ["80 %", "20 %", "125 %", "8 %"], ans: 0, exp: "η = 800/1000 = 80 %." },
        { q: "Un auto avanza a 20 m/s contra una resistencia de 500 N. ¿Qué potencia desarrolla el motor?", opts: ["25 W", "10 kW", "520 W", "1 kW"], ans: 1, exp: "P = F·v = 500·20 = 10 000 W." },
        { q: "¿A qué unidad equivale el watt?", opts: ["N·m", "J/s", "kg·m/s", "J·s"], ans: 1, exp: "Un watt es un joule por segundo." },
      ],
    },
  },
  {
    name: "Semana 12: Cantidad de Movimiento e Impulso",
    desc: "Momento lineal, impulso y conservación.",
    content: String.raw`**Cantidad de movimiento (momento lineal):** $\vec{p} = m\vec{v}$.

**Impulso:** $\vec{J} = \vec{F}\,\Delta t = \Delta\vec{p}$.
Aumentar el tiempo de contacto reduce la fuerza (bolsas de aire, rodillas flexionadas al caer).

**Conservación:** si la fuerza externa neta es cero, el momento total se conserva:
$$m_1 v_{1i} + m_2 v_{2i} = m_1 v_{1f} + m_2 v_{2f}$$

**Ejemplo:** una pelota de 0.2 kg llega a 10 m/s y rebota a 10 m/s en sentido contrario: $\Delta p = 0.2(-10) - 0.2(10) = -4\ \text{kg·m/s}$.`,
    quiz: {
      title: "Evaluación: Momento e Impulso",
      qs: [
        { q: "¿Qué momento lineal tiene una masa de 3 kg a 4 m/s?", opts: ["7 kg·m/s", "12 kg·m/s", "0.75 kg·m/s", "24 kg·m/s"], ans: 1, exp: "p = m·v = 3·4 = 12 kg·m/s." },
        { q: "Una pelota de 0.2 kg llega a 10 m/s y rebota a 10 m/s. ¿Cuál es la magnitud del cambio de momento?", opts: ["0", "2 kg·m/s", "4 kg·m/s", "20 kg·m/s"], ans: 2, exp: "|Δp| = 0.2·(10 − (−10)) = 4 kg·m/s." },
        { q: "¿Por qué una bolsa de aire reduce la fuerza en un choque?", opts: ["Reduce el impulso", "Aumenta el tiempo de contacto", "Aumenta la velocidad", "Reduce la masa"], ans: 1, exp: "Con el mismo Δp, un Δt mayor implica una F menor." },
        { q: "¿Cuándo se conserva el momento total de un sistema?", opts: ["Siempre", "Cuando la fuerza externa neta es cero", "Solo en choques elásticos", "Cuando la energía se conserva"], ans: 1, exp: "Sin fuerza externa neta no hay impulso externo." },
      ],
    },
  },
  {
    name: "Semana 13: Colisiones",
    desc: "Choques elásticos, inelásticos y perfectamente inelásticos.",
    content: String.raw`En **todo** choque aislado se conserva el momento lineal. La energía cinética depende del tipo:

| Tipo | Momento | Energía cinética |
|---|---|---|
| Elástico | Se conserva | Se conserva |
| Inelástico | Se conserva | Se pierde parte |
| Perfectamente inelástico | Se conserva | Máxima pérdida (quedan unidos) |

**Perfectamente inelástico:** $v_f = \frac{m_1 v_1 + m_2 v_2}{m_1 + m_2}$.

**Ejemplo:** un vagón de 2 kg a 3 m/s choca con otro de 1 kg en reposo y quedan unidos: $v_f = \frac{6}{3} = 2$ m/s. La energía cinética pasa de 9 J a 6 J.`,
    quiz: {
      title: "Evaluación: Colisiones",
      qs: [
        { q: "Un vagón de 2 kg a 3 m/s choca con otro de 1 kg en reposo y quedan unidos. ¿Velocidad final?", opts: ["1 m/s", "2 m/s", "3 m/s", "1.5 m/s"], ans: 1, exp: "v = (2·3)/(2 + 1) = 2 m/s." },
        { q: "¿Qué se conserva en un choque perfectamente inelástico aislado?", opts: ["Solo la energía cinética", "Solo el momento lineal", "Ambos", "Ninguno"], ans: 1, exp: "El momento se conserva, pero se pierde energía cinética." },
        { q: "En el ejemplo anterior, ¿cuánta energía cinética se pierde?", opts: ["0 J", "3 J", "6 J", "9 J"], ans: 1, exp: "Antes: ½·2·9 = 9 J. Después: ½·3·4 = 6 J. Se pierden 3 J." },
        { q: "En un choque elástico se conservan:", opts: ["Momento y energía cinética", "Solo el momento", "Solo la energía", "La velocidad de cada cuerpo"], ans: 0, exp: "Esa es la definición de choque elástico." },
      ],
    },
  },
  {
    name: "Semana 14: Torque y Equilibrio",
    desc: "Momento de una fuerza y condiciones de equilibrio estático.",
    content: String.raw`**Torque (momento de fuerza):** $\tau = r\,F\sin\theta$ (N·m). Mide la capacidad de una fuerza para hacer girar un cuerpo.
- Es máximo cuando la fuerza es perpendicular al brazo.
- Por convención, el giro antihorario es positivo.

**Condiciones de equilibrio estático:**
$$\sum \vec{F} = 0 \qquad \sum \tau = 0$$

**Ejemplo (balancín):** un niño de 30 kg a 2 m del pivote se equilibra con otro de 40 kg sentado a $d$:
$30(2) = 40\,d \Rightarrow d = 1.5$ m.

**Consejo:** elige el pivote donde actúe una fuerza desconocida; así su torque es cero y desaparece de la ecuación.`,
    quiz: {
      title: "Evaluación: Torque y Equilibrio",
      qs: [
        { q: "Se aplican 20 N perpendiculares a una llave de 0.3 m. ¿Qué torque se genera?", opts: ["6 N·m", "66.7 N·m", "20.3 N·m", "0.015 N·m"], ans: 0, exp: "τ = r·F = 0.3·20 = 6 N·m." },
        { q: "Un niño de 30 kg está a 2 m del pivote. ¿A qué distancia debe sentarse uno de 40 kg para equilibrar?", opts: ["1 m", "1.5 m", "2.67 m", "2 m"], ans: 1, exp: "30·2 = 40·d → d = 1.5 m." },
        { q: "¿Con qué ángulo entre r y F el torque es máximo?", opts: ["0°", "45°", "90°", "180°"], ans: 2, exp: "sin 90° = 1." },
        { q: "Para que un cuerpo rígido esté en equilibrio estático se requiere:", opts: ["Solo ΣF = 0", "Solo Στ = 0", "ΣF = 0 y Στ = 0", "Que la velocidad sea constante"], ans: 2, exp: "No debe trasladarse ni rotar." },
      ],
    },
  },
];
