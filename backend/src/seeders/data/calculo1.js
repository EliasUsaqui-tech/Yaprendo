// Contenido de Cálculo 1 (CAL1): resumen teórico + autoevaluación por semana.
// Se usan String.raw para que las fórmulas LaTeX no necesiten doble barra invertida.

export const calculo1 = [
  {
    name: "Semana 1: Funciones y Modelos",
    desc: "Funciones como modelos de situaciones reales.",
    content: String.raw`Una **función** $f$ asigna a cada $x$ del dominio un único valor $f(x)$. En Cálculo se usan para **modelar** fenómenos: costo, población, posición, temperatura.

**Cómo construir un modelo:**
1. Identifica la variable independiente (por ejemplo, el tiempo $t$) y la dependiente.
2. Traduce el enunciado a una expresión: "aumenta 3 por cada hora" → $f(t) = 3t + b$.
3. Define el **dominio práctico** (por ejemplo, $t \ge 0$).

**Prueba de la recta vertical:** una gráfica representa una función si ninguna recta vertical la corta en más de un punto.

**Ejemplo:** Una caja sin tapa se arma cortando cuadrados de lado $x$ en una lámina de $20 \times 20$ cm. Su volumen es $V(x) = x(20-2x)^2$, con dominio $0 < x < 10$.`,
    quiz: {
      title: "Evaluación: Funciones y Modelos",
      qs: [
        { q: "Un taxi cobra S/ 5 de bajada de bandera y S/ 2 por km. ¿Qué función modela el costo C(x) por x km?", opts: ["C(x) = 5x + 2", "C(x) = 2x + 5", "C(x) = 7x", "C(x) = 5 + x/2"], ans: 1, exp: "El costo fijo es 5 y la tasa de cambio es 2 por km: C(x) = 2x + 5." },
        { q: "¿Qué indica la prueba de la recta vertical?", opts: ["Si la función es creciente", "Si la gráfica representa una función", "Si la función es par", "Dónde está el máximo"], ans: 1, exp: "Si una recta vertical corta la gráfica en más de un punto, a un x le corresponderían dos valores: no es función." },
        { q: "Para V(x) = x(20 − 2x)², ¿cuál es el dominio práctico?", opts: ["x > 0", "0 < x < 10", "0 < x < 20", "Todos los reales"], ans: 1, exp: "El lado cortado debe ser positivo y 20 − 2x > 0, entonces 0 < x < 10." },
        { q: "Si f(x) = x² − 1, ¿cuánto vale f(3) − f(1)?", opts: ["8", "6", "9", "4"], ans: 0, exp: "f(3) = 8 y f(1) = 0, entonces la diferencia es 8." },
      ],
    },
  },
  {
    name: "Semana 2: Tipos de Funciones",
    desc: "Polinómicas, racionales, potencia, exponenciales y transformaciones.",
    content: String.raw`**Familias principales:**
- **Polinómicas:** $p(x) = a_n x^n + \dots + a_0$. Dominio: todos los reales.
- **Racionales:** $r(x) = \frac{p(x)}{q(x)}$. Se excluyen los $x$ con $q(x) = 0$.
- **Potencia y raíz:** $x^a$; si hay raíz par, el radicando debe ser $\ge 0$.
- **Exponenciales y logarítmicas:** $b^x$ y $\log_b x$ (con $x > 0$).

**Transformaciones de $y = f(x)$:**
- $f(x) + c$: sube $c$ unidades. $f(x - c)$: se desplaza $c$ a la derecha.
- $-f(x)$: refleja respecto al eje $x$. $c\,f(x)$ con $c>1$: estira verticalmente.

**Paridad:** $f$ es **par** si $f(-x) = f(x)$ (simétrica al eje $y$) e **impar** si $f(-x) = -f(x)$ (simétrica al origen).`,
    quiz: {
      title: "Evaluación: Tipos de Funciones",
      qs: [
        { q: "¿Cuál es el dominio de r(x) = (x + 1)/(x² − 9)?", opts: ["x ≠ 3", "x ≠ ±3", "x ≠ −1", "Todos los reales"], ans: 1, exp: "El denominador se anula en x = 3 y x = −3." },
        { q: "La gráfica de y = (x − 2)² + 1 se obtiene de y = x² desplazándola:", opts: ["2 a la izquierda y 1 arriba", "2 a la derecha y 1 arriba", "2 a la derecha y 1 abajo", "1 a la derecha y 2 arriba"], ans: 1, exp: "f(x − 2) desplaza 2 a la derecha y + 1 sube una unidad." },
        { q: "¿Cuál de estas funciones es impar?", opts: ["f(x) = x² + 1", "f(x) = x³ − x", "f(x) = |x|", "f(x) = cos x"], ans: 1, exp: "f(−x) = −x³ + x = −(x³ − x) = −f(x)." },
        { q: "¿Qué tipo de función es f(x) = 3·2ˣ?", opts: ["Potencia", "Polinómica", "Exponencial", "Racional"], ans: 2, exp: "La variable está en el exponente: es exponencial." },
      ],
    },
  },
  {
    name: "Semana 3: Funciones Especiales",
    desc: "Valor absoluto, a trozos, inversas y trigonométricas inversas.",
    content: String.raw`**Valor absoluto:** $|x| = x$ si $x \ge 0$ y $|x| = -x$ si $x < 0$.

**Funciones a trozos:** se definen con reglas distintas en cada intervalo. Para evaluarlas, primero identifica en qué tramo cae $x$.

**Función inversa $f^{-1}$:** existe si $f$ es **inyectiva** (pasa la prueba de la recta horizontal). Para hallarla: escribe $y = f(x)$, despeja $x$ e intercambia variables. Se cumple $f(f^{-1}(x)) = x$.

**Trigonométricas inversas:** $\arcsin x$ tiene dominio $[-1, 1]$ y rango $[-\frac{\pi}{2}, \frac{\pi}{2}]$; $\arctan x$ tiene rango $(-\frac{\pi}{2}, \frac{\pi}{2})$.

**Ejemplo:** si $f(x) = 2x + 3$, entonces $f^{-1}(x) = \frac{x-3}{2}$.`,
    quiz: {
      title: "Evaluación: Funciones Especiales",
      qs: [
        { q: "Si f(x) = 2x + 3, ¿cuál es f⁻¹(x)?", opts: ["(x − 3)/2", "(x + 3)/2", "2x − 3", "1/(2x + 3)"], ans: 0, exp: "y = 2x + 3 → x = (y − 3)/2; se intercambian variables." },
        { q: "Sea f(x) = x² si x < 0, y f(x) = 2x + 1 si x ≥ 0. ¿Cuánto vale f(−3) + f(2)?", opts: ["14", "4", "−4", "10"], ans: 0, exp: "f(−3) = 9 (primer tramo) y f(2) = 5 (segundo tramo). Suma: 14." },
        { q: "¿Qué prueba garantiza que una función tiene inversa?", opts: ["Recta vertical", "Recta horizontal", "Simetría con el eje y", "Que sea continua"], ans: 1, exp: "Si ninguna recta horizontal corta la gráfica más de una vez, la función es inyectiva." },
        { q: "¿Cuál es el valor de arcsin(1/2)?", opts: ["π/3", "π/6", "π/4", "π/2"], ans: 1, exp: "sin(π/6) = 1/2 y π/6 está en el rango [−π/2, π/2]." },
      ],
    },
  },
  {
    name: "Semana 4: Límites y Continuidad",
    desc: "Cálculo de límites, indeterminaciones y continuidad.",
    content: String.raw`El **límite** $\lim_{x \to a} f(x) = L$ indica que $f(x)$ se acerca a $L$ cuando $x$ se acerca a $a$ (sin importar el valor en $a$).

**Estrategias para $\frac{0}{0}$:**
1. **Factorizar y simplificar:** $\lim_{x\to 2}\frac{x^2-4}{x-2} = \lim_{x\to 2}(x+2) = 4$.
2. **Racionalizar** cuando hay raíces.
3. **Límite notable:** $\lim_{x\to 0}\frac{\sin x}{x} = 1$.

**Límites laterales:** el límite existe solo si $\lim_{x\to a^-} f = \lim_{x\to a^+} f$.

**Continuidad en $x = a$:** se cumplen tres condiciones: $f(a)$ existe, el límite existe y $\lim_{x\to a} f(x) = f(a)$.

**Límites al infinito:** en cocientes de polinomios del mismo grado, el límite es el cociente de los coeficientes principales.`,
    quiz: {
      title: "Evaluación: Límites y Continuidad",
      qs: [
        { q: "¿Cuánto vale lím (x→2) (x² − 4)/(x − 2)?", opts: ["0", "2", "4", "No existe"], ans: 2, exp: "Se factoriza: (x − 2)(x + 2)/(x − 2) = x + 2 → 4." },
        { q: "¿Cuánto vale lím (x→0) sin(3x)/x?", opts: ["1", "3", "0", "1/3"], ans: 1, exp: "sin(3x)/x = 3·sin(3x)/(3x) → 3·1 = 3." },
        { q: "¿Cuánto vale lím (x→∞) (3x² + 1)/(2x² − 5)?", opts: ["0", "∞", "3/2", "−1/5"], ans: 2, exp: "Mismo grado: cociente de coeficientes principales 3/2." },
        { q: "Si los límites laterales de f en x = 1 son 2 y 5, entonces:", opts: ["El límite es 3.5", "El límite no existe", "f es continua en 1", "El límite es 5"], ans: 1, exp: "Si los límites laterales son distintos, el límite no existe." },
      ],
    },
  },
  {
    name: "Semana 5: Definición de Derivada",
    desc: "Recta tangente, razón de cambio instantánea y definición por límite.",
    content: String.raw`La **derivada** mide la razón de cambio instantánea y la pendiente de la recta tangente:
$$f'(x) = \lim_{h \to 0} \frac{f(x+h) - f(x)}{h}$$

**Interpretación:**
- Si $s(t)$ es posición, $s'(t)$ es la **velocidad**.
- $f'(a)$ es la pendiente de la tangente en $(a, f(a))$.

**Recta tangente:** $y - f(a) = f'(a)(x - a)$.

**Ejemplo con la definición:** para $f(x) = x^2$:
$\frac{(x+h)^2 - x^2}{h} = 2x + h \to 2x$. Entonces $f'(x) = 2x$.

**Derivabilidad:** si $f$ es derivable en $a$, es continua en $a$. Lo contrario no siempre es cierto: $|x|$ es continua en 0 pero no derivable (tiene un "pico").`,
    quiz: {
      title: "Evaluación: Definición de Derivada",
      qs: [
        { q: "Usando la definición, ¿cuál es la derivada de f(x) = x²?", opts: ["x", "2x", "x²/2", "2"], ans: 1, exp: "[(x + h)² − x²]/h = 2x + h → 2x cuando h → 0." },
        { q: "Si s(t) es la posición de un móvil, s'(t) representa:", opts: ["La aceleración", "La distancia total", "La velocidad instantánea", "El tiempo"], ans: 2, exp: "La derivada de la posición respecto al tiempo es la velocidad." },
        { q: "Para f(x) = x², ¿cuál es la recta tangente en x = 3?", opts: ["y = 6x − 9", "y = 6x + 9", "y = 3x", "y = 9x − 6"], ans: 0, exp: "f(3) = 9 y f'(3) = 6: y − 9 = 6(x − 3) → y = 6x − 9." },
        { q: "¿Por qué f(x) = |x| no es derivable en x = 0?", opts: ["Porque no es continua", "Porque las pendientes laterales son distintas", "Porque f(0) no existe", "Sí es derivable"], ans: 1, exp: "A la izquierda la pendiente es −1 y a la derecha +1: hay un pico." },
      ],
    },
  },
  {
    name: "Semana 6: Reglas de Derivación",
    desc: "Potencia, producto, cociente y regla de la cadena.",
    content: String.raw`**Reglas básicas:**
- Potencia: $(x^n)' = n x^{n-1}$
- Producto: $(fg)' = f'g + fg'$
- Cociente: $\left(\frac{f}{g}\right)' = \frac{f'g - fg'}{g^2}$
- **Cadena:** $(f(g(x)))' = f'(g(x))\cdot g'(x)$

**Derivadas que debes recordar:**
$(\sin x)' = \cos x$, $(\cos x)' = -\sin x$, $(e^x)' = e^x$, $(\ln x)' = \frac{1}{x}$.

**Ejemplo (cadena):** $\frac{d}{dx}(3x^2+1)^5 = 5(3x^2+1)^4 \cdot 6x = 30x(3x^2+1)^4$.

**Derivación implícita:** si $x^2 + y^2 = 25$, derivas ambos lados: $2x + 2y\,y' = 0 \Rightarrow y' = -\frac{x}{y}$.`,
    quiz: {
      title: "Evaluación: Reglas de Derivación",
      qs: [
        { q: "¿Cuál es la derivada de f(x) = 4x³ − 2x + 7?", opts: ["12x² − 2", "12x² − 2x", "4x² − 2", "12x³ − 2"], ans: 0, exp: "Regla de la potencia: 3·4x² − 2 = 12x² − 2." },
        { q: "¿Cuál es la derivada de f(x) = x·eˣ?", opts: ["eˣ", "x·eˣ", "eˣ(1 + x)", "eˣ − x"], ans: 2, exp: "Regla del producto: 1·eˣ + x·eˣ = eˣ(1 + x)." },
        { q: "¿Cuál es la derivada de f(x) = sin(x²)?", opts: ["cos(x²)", "2x·cos(x²)", "−2x·cos(x²)", "2x·sin(x²)"], ans: 1, exp: "Regla de la cadena: cos(x²)·2x." },
        { q: "Si x² + y² = 25, ¿cuánto vale y' en el punto (3, 4)?", opts: ["3/4", "−3/4", "4/3", "−4/3"], ans: 1, exp: "y' = −x/y = −3/4." },
      ],
    },
  },
  {
    name: "Semana 7: Aplicaciones de la Derivada",
    desc: "Máximos y mínimos, crecimiento, concavidad y optimización.",
    content: String.raw`**Puntos críticos:** valores donde $f'(x) = 0$ o $f'$ no existe.

**Criterio de la primera derivada:**
- $f' > 0$: $f$ crece. $f' < 0$: $f$ decrece.
- Si $f'$ cambia de $+$ a $-$, hay un **máximo local**; de $-$ a $+$, un **mínimo local**.

**Segunda derivada:** $f'' > 0$ → cóncava hacia arriba (mínimo si $f'=0$); $f'' < 0$ → cóncava hacia abajo (máximo). Donde la concavidad cambia hay un **punto de inflexión**.

**Optimización (pasos):**
1. Dibuja y define variables.
2. Escribe la función a optimizar en una sola variable usando la restricción.
3. Deriva, iguala a cero y verifica que sea máximo o mínimo.

**Ejemplo:** con 40 m de cerca, el rectángulo de mayor área es un cuadrado de 10 m de lado ($A = x(20-x)$, $A' = 20 - 2x = 0$).`,
    quiz: {
      title: "Evaluación: Aplicaciones de la Derivada",
      qs: [
        { q: "¿Cuáles son los puntos críticos de f(x) = x³ − 3x?", opts: ["x = 0", "x = ±1", "x = ±3", "x = 3"], ans: 1, exp: "f'(x) = 3x² − 3 = 0 → x = ±1." },
        { q: "Si f'(2) = 0 y f''(2) = −4, en x = 2 hay:", opts: ["Un mínimo local", "Un máximo local", "Un punto de inflexión", "No se puede saber"], ans: 1, exp: "Pendiente nula y concavidad hacia abajo: máximo local." },
        { q: "Con 40 m de cerca, ¿qué dimensiones dan el rectángulo de mayor área?", opts: ["5 × 15", "10 × 10", "8 × 12", "4 × 16"], ans: 1, exp: "A(x) = x(20 − x), A'(x) = 20 − 2x = 0 → x = 10: un cuadrado de 10 × 10." },
        { q: "¿En qué intervalo decrece f(x) = x² − 4x?", opts: ["x > 2", "x < 2", "x < 0", "Nunca decrece"], ans: 1, exp: "f'(x) = 2x − 4 < 0 cuando x < 2." },
      ],
    },
  },
  {
    name: "Semana 8: Diferenciales",
    desc: "Aproximación lineal y estimación de errores.",
    content: String.raw`**Aproximación lineal (linealización)** de $f$ cerca de $a$:
$$L(x) = f(a) + f'(a)(x - a)$$

**Diferencial:** $dy = f'(x)\,dx$. Aproxima el cambio real $\Delta y$ cuando $dx$ es pequeño.

**Ejemplo:** estimar $\sqrt{4.1}$. Con $f(x) = \sqrt{x}$, $a = 4$: $f(4) = 2$ y $f'(4) = \frac{1}{4}$. Entonces $\sqrt{4.1} \approx 2 + \frac{1}{4}(0.1) = 2.025$.

**Propagación de errores:** si el radio de una esfera se mide con error $dr$, el error en el volumen es $dV = 4\pi r^2\,dr$. El **error relativo** es $\frac{dV}{V}$.`,
    quiz: {
      title: "Evaluación: Diferenciales",
      qs: [
        { q: "Usando linealización en a = 4, ¿cuánto es aproximadamente √4.1?", opts: ["2.05", "2.025", "2.01", "2.1"], ans: 1, exp: "L(x) = 2 + (1/4)(x − 4) → 2 + 0.025 = 2.025." },
        { q: "Si y = x³, ¿cuál es el diferencial dy?", opts: ["3x² dx", "x³ dx", "3x dx", "x² dx"], ans: 0, exp: "dy = f'(x) dx = 3x² dx." },
        { q: "El radio de una esfera es 10 cm, con un error de 0.1 cm. ¿Cuál es el error aproximado del volumen?", opts: ["4π cm³", "40π cm³", "400π cm³", "0.4π cm³"], ans: 1, exp: "dV = 4πr² dr = 4π(100)(0.1) = 40π cm³." },
        { q: "¿Qué representa L(x) = f(a) + f'(a)(x − a)?", opts: ["La recta normal", "La recta tangente usada para aproximar f cerca de a", "La segunda derivada", "El área bajo la curva"], ans: 1, exp: "Es la ecuación de la recta tangente, que aproxima f cerca de a." },
      ],
    },
  },
  {
    name: "Semana 9: Velocidades Relacionadas",
    desc: "Razones de cambio relacionadas con el tiempo.",
    content: String.raw`Cuando varias magnitudes cambian con el tiempo y están relacionadas por una ecuación, sus derivadas también lo están.

**Pasos:**
1. Dibuja y nombra las variables que cambian.
2. Escribe la ecuación que las relaciona (Pitágoras, volumen, semejanza).
3. **Deriva respecto a $t$** con la regla de la cadena.
4. Sustituye los valores del instante pedido **después** de derivar.

**Ejemplo (escalera):** una escalera de 10 m se desliza. Si la base se aleja a 1 m/s, ¿qué tan rápido baja la parte superior cuando la base está a 6 m?
$x^2 + y^2 = 100 \Rightarrow 2x\,x' + 2y\,y' = 0$. Con $x = 6$, $y = 8$, $x' = 1$: $y' = -\frac{6}{8} = -0.75$ m/s.`,
    quiz: {
      title: "Evaluación: Velocidades Relacionadas",
      qs: [
        { q: "En el problema de la escalera de 10 m (x = 6, y = 8, x' = 1 m/s), ¿cuánto vale y'?", opts: ["−0.75 m/s", "−1.33 m/s", "0.75 m/s", "−0.6 m/s"], ans: 0, exp: "2x·x' + 2y·y' = 0 → y' = −(6·1)/8 = −0.75 m/s." },
        { q: "¿Cuándo se sustituyen los valores numéricos del instante pedido?", opts: ["Antes de derivar", "Después de derivar", "No se sustituyen", "Da igual"], ans: 1, exp: "Si sustituyes antes, las variables quedan constantes y su derivada se pierde." },
        { q: "El radio de un círculo crece a 2 cm/s. ¿A qué ritmo crece el área cuando r = 5 cm?", opts: ["10π cm²/s", "20π cm²/s", "25π cm²/s", "4π cm²/s"], ans: 1, exp: "A = πr² → A' = 2πr·r' = 2π(5)(2) = 20π cm²/s." },
        { q: "Un cubo de lado x aumenta su lado a 1 cm/s. ¿Qué expresión da dV/dt?", opts: ["3x²", "x³", "3x", "6x"], ans: 0, exp: "V = x³ → V' = 3x²·x' = 3x²·1." },
      ],
    },
  },
  {
    name: "Semana 10: Repaso y Problemas",
    desc: "Integración de límites y derivadas en problemas tipo examen.",
    content: String.raw`**Checklist antes del examen parcial:**
1. **Límites:** ¿es indeterminación $\frac{0}{0}$? Factoriza, racionaliza o usa $\frac{\sin x}{x} \to 1$.
2. **Continuidad:** verifica las tres condiciones en los puntos de cambio de tramo.
3. **Derivadas:** identifica primero la regla "exterior" (producto, cociente o cadena).
4. **Optimización:** no olvides justificar que el punto crítico es máximo o mínimo.
5. **Velocidades relacionadas:** deriva antes de sustituir.

**Errores frecuentes:**
- $(f\cdot g)' \ne f'\cdot g'$.
- Olvidar multiplicar por la derivada interna en la regla de la cadena.
- Confundir $f'(a) = 0$ con un máximo garantizado (puede ser un punto de inflexión, como en $x^3$).`,
    quiz: {
      title: "Evaluación: Repaso Parcial",
      qs: [
        { q: "¿Cuál es la derivada de f(x) = ln(x² + 1)?", opts: ["1/(x² + 1)", "2x/(x² + 1)", "2x·ln(x² + 1)", "x/(x² + 1)"], ans: 1, exp: "Cadena: (1/(x² + 1))·2x." },
        { q: "Para f(x) = x³, en x = 0 se cumple f'(0) = 0. ¿Qué hay en ese punto?", opts: ["Un máximo", "Un mínimo", "Un punto de inflexión", "Una discontinuidad"], ans: 2, exp: "f' no cambia de signo y f'' cambia de signo: es un punto de inflexión." },
        { q: "¿Para qué valor de k es continua f(x) = kx + 1 (x < 2), f(x) = x² (x ≥ 2)?", opts: ["k = 1", "k = 1.5", "k = 2", "k = 3"], ans: 1, exp: "Los límites deben coincidir en 2: 2k + 1 = 4 → k = 1.5." },
        { q: "¿Cuál es la derivada de f(x) = (x + 1)/(x − 1)?", opts: ["2/(x − 1)²", "−2/(x − 1)²", "1", "−1/(x − 1)²"], ans: 1, exp: "Cociente: [(x − 1) − (x + 1)]/(x − 1)² = −2/(x − 1)²." },
      ],
    },
  },
  {
    name: "Semana 11: Integrales Indefinidas",
    desc: "Antiderivadas, reglas básicas y sustitución.",
    content: String.raw`Una **antiderivada** de $f$ es una función $F$ tal que $F' = f$. La integral indefinida reúne todas:
$$\int f(x)\,dx = F(x) + C$$

**Reglas básicas:**
- $\int x^n\,dx = \frac{x^{n+1}}{n+1} + C$ (con $n \ne -1$)
- $\int \frac{1}{x}\,dx = \ln|x| + C$
- $\int e^x\,dx = e^x + C$, $\int \cos x\,dx = \sin x + C$, $\int \sin x\,dx = -\cos x + C$

**Sustitución ($u$):** se usa cuando aparece una función y su derivada.
Ejemplo: $\int 2x\cos(x^2)\,dx$. Con $u = x^2$, $du = 2x\,dx$: $\int \cos u\,du = \sin(x^2) + C$.

**No olvides la constante $C$.**`,
    quiz: {
      title: "Evaluación: Integrales Indefinidas",
      qs: [
        { q: "¿Cuánto es ∫ 3x² dx?", opts: ["6x + C", "x³ + C", "3x³ + C", "x³/3 + C"], ans: 1, exp: "3·x³/3 = x³, más la constante C." },
        { q: "¿Cuánto es ∫ (1/x) dx?", opts: ["x⁰ + C", "ln|x| + C", "−1/x² + C", "eˣ + C"], ans: 1, exp: "Es el caso n = −1: su antiderivada es ln|x|." },
        { q: "¿Cuánto es ∫ 2x·cos(x²) dx?", opts: ["sin(x²) + C", "2·sin(x²) + C", "−sin(x²) + C", "x²·sin(x) + C"], ans: 0, exp: "Con u = x², du = 2x dx: ∫ cos u du = sin(x²) + C." },
        { q: "¿Por qué se agrega + C?", opts: ["Por convención, sin motivo", "Porque la derivada de una constante es 0", "Para hacer más larga la respuesta", "Solo en integrales definidas"], ans: 1, exp: "Infinitas funciones que difieren en una constante tienen la misma derivada." },
      ],
    },
  },
  {
    name: "Semana 12: Sumas de Riemann",
    desc: "Aproximación del área bajo una curva con rectángulos.",
    content: String.raw`Para aproximar el área bajo $f$ en $[a, b]$ se divide el intervalo en $n$ partes de ancho $\Delta x = \frac{b-a}{n}$ y se suman rectángulos:
$$S_n = \sum_{i=1}^{n} f(x_i^*)\,\Delta x$$

**Elección del punto $x_i^*$:** extremo izquierdo, derecho o punto medio.
- Si $f$ es creciente, la suma por la izquierda **subestima** y por la derecha **sobreestima**.

**Ejemplo:** $f(x) = x^2$ en $[0, 2]$ con $n = 4$ (derecha): $\Delta x = 0.5$,
$S_4 = 0.5(0.25 + 1 + 2.25 + 4) = 3.75$. El valor exacto es $\frac{8}{3} \approx 2.67$.

Cuando $n \to \infty$, la suma converge a la **integral definida**.`,
    quiz: {
      title: "Evaluación: Sumas de Riemann",
      qs: [
        { q: "Para [0, 2] con n = 4, ¿cuánto vale Δx?", opts: ["0.25", "0.5", "2", "4"], ans: 1, exp: "Δx = (2 − 0)/4 = 0.5." },
        { q: "Si f es creciente, la suma de Riemann por la derecha:", opts: ["Subestima el área", "Sobreestima el área", "Da el valor exacto", "Es negativa"], ans: 1, exp: "Cada rectángulo usa la altura mayor del subintervalo." },
        { q: "¿Qué ocurre con la suma de Riemann cuando n → ∞?", opts: ["Diverge", "Tiende a la integral definida", "Tiende a 0", "Se vuelve la derivada"], ans: 1, exp: "Esa es la definición de la integral definida." },
        { q: "Para f(x) = x en [0, 2] con n = 2 por la izquierda, ¿cuánto da la suma?", opts: ["1", "2", "3", "0.5"], ans: 0, exp: "Δx = 1; alturas f(0) = 0 y f(1) = 1 → 1·(0 + 1) = 1." },
      ],
    },
  },
  {
    name: "Semana 13: Integral Definida",
    desc: "Teorema Fundamental del Cálculo y propiedades.",
    content: String.raw`**Teorema Fundamental del Cálculo (TFC):**
- Parte 1: si $g(x) = \int_a^x f(t)\,dt$, entonces $g'(x) = f(x)$.
- Parte 2: $\int_a^b f(x)\,dx = F(b) - F(a)$, donde $F' = f$.

**Propiedades:**
- $\int_a^a f = 0$ y $\int_b^a f = -\int_a^b f$.
- $\int_a^b [f + g] = \int_a^b f + \int_a^b g$.

**Ejemplo:** $\int_0^2 x^2\,dx = \left[\frac{x^3}{3}\right]_0^2 = \frac{8}{3}$.

**Sustitución en definidas:** cambia también los límites. En $\int_0^1 2x(x^2+1)^3\,dx$, con $u = x^2+1$, los límites pasan a $u = 1$ y $u = 2$.`,
    quiz: {
      title: "Evaluación: Integral Definida",
      qs: [
        { q: "¿Cuánto vale ∫₀² x² dx?", opts: ["4", "8/3", "2", "8"], ans: 1, exp: "[x³/3] de 0 a 2 = 8/3." },
        { q: "Si g(x) = ∫₀ˣ cos(t²) dt, ¿cuánto vale g'(x)?", opts: ["sin(x²)", "cos(x²)", "2x·cos(x²)", "−sin(x²)"], ans: 1, exp: "Por el TFC parte 1, g'(x) = cos(x²)." },
        { q: "¿Cuánto vale ∫₁³ (2x + 1) dx?", opts: ["8", "10", "12", "6"], ans: 1, exp: "[x² + x] de 1 a 3 = (9 + 3) − (1 + 1) = 10." },
        { q: "Si ∫₀⁵ f dx = 7, ¿cuánto vale ∫₅⁰ f dx?", opts: ["7", "−7", "0", "35"], ans: 1, exp: "Invertir los límites cambia el signo." },
      ],
    },
  },
  {
    name: "Semana 14: Áreas y Valor Promedio",
    desc: "Área entre curvas y valor promedio de una función.",
    content: String.raw`**Área entre curvas:** si $f(x) \ge g(x)$ en $[a, b]$:
$$A = \int_a^b [f(x) - g(x)]\,dx$$
Primero halla los **puntos de corte** igualando $f(x) = g(x)$ y verifica cuál función está arriba.

**Ejemplo:** área entre $y = x$ y $y = x^2$. Se cortan en $x = 0$ y $x = 1$, y en ese tramo $x \ge x^2$:
$A = \int_0^1 (x - x^2)\,dx = \frac{1}{2} - \frac{1}{3} = \frac{1}{6}$.

**Valor promedio** de $f$ en $[a, b]$:
$$f_{prom} = \frac{1}{b-a}\int_a^b f(x)\,dx$$
Ejemplo: el promedio de $x^2$ en $[0, 3]$ es $\frac{1}{3}\cdot 9 = 3$.`,
    quiz: {
      title: "Evaluación: Áreas y Valor Promedio",
      qs: [
        { q: "¿Cuál es el área entre y = x e y = x² en [0, 1]?", opts: ["1/2", "1/3", "1/6", "1"], ans: 2, exp: "∫₀¹ (x − x²) dx = 1/2 − 1/3 = 1/6." },
        { q: "¿Cuál es el valor promedio de f(x) = x² en [0, 3]?", opts: ["9", "3", "4.5", "1"], ans: 1, exp: "(1/3)·∫₀³ x² dx = (1/3)·9 = 3." },
        { q: "¿Qué es lo primero para calcular el área entre dos curvas?", opts: ["Derivar ambas", "Hallar los puntos de corte", "Sumar las funciones", "Usar Riemann con n = 1"], ans: 1, exp: "Los puntos de corte dan los límites de integración." },
        { q: "¿Cuál es el valor promedio de f(x) = 2x en [0, 4]?", opts: ["2", "4", "8", "16"], ans: 1, exp: "(1/4)·[x²] de 0 a 4 = (1/4)·16 = 4." },
      ],
    },
  },
  {
    name: "Semana 15: Ecuaciones Diferenciales",
    desc: "Ecuaciones separables y modelos de crecimiento.",
    content: String.raw`Una **ecuación diferencial** relaciona una función con sus derivadas.

**Ecuaciones separables:** $\frac{dy}{dx} = g(x)\,h(y)$. Se separan e integran:
$$\int \frac{dy}{h(y)} = \int g(x)\,dx$$

**Crecimiento/decaimiento exponencial:** $\frac{dy}{dt} = ky \Rightarrow y = y_0 e^{kt}$.
- $k > 0$: crecimiento (poblaciones, interés). $k < 0$: decaimiento (radiactividad, medicamentos).

**Ley de enfriamiento de Newton:** $\frac{dT}{dt} = k(T - T_a)$, cuya solución es $T = T_a + (T_0 - T_a)e^{kt}$.

**Condición inicial:** permite hallar la constante $C$. Ejemplo: $y' = 2x$, $y(0) = 3 \Rightarrow y = x^2 + 3$.`,
    quiz: {
      title: "Evaluación: Ecuaciones Diferenciales",
      qs: [
        { q: "¿Cuál es la solución de y' = 2x con y(0) = 3?", opts: ["y = x² + 3", "y = 2x + 3", "y = x²", "y = 3e^(2x)"], ans: 0, exp: "Se integra: y = x² + C; y(0) = 3 → C = 3." },
        { q: "¿Cuál es la solución general de dy/dt = ky?", opts: ["y = kt + C", "y = y₀·e^(kt)", "y = y₀·kt", "y = ln(kt)"], ans: 1, exp: "Al separar: dy/y = k dt → ln y = kt + C → y = y₀·e^(kt)." },
        { q: "Una población se duplica cada 3 horas. ¿Cuánto vale k?", opts: ["ln(2)/3", "3/ln(2)", "2/3", "ln(3)/2"], ans: 0, exp: "2 = e^(3k) → k = ln(2)/3." },
        { q: "¿Cuál de estas ecuaciones es separable?", opts: ["y' = x·y", "y' = x + y", "y' + y² = sin(x + y)", "y'' = y"], ans: 0, exp: "x·y se escribe como g(x)·h(y): dy/y = x dx." },
      ],
    },
  },
  {
    name: "Semana 16: Repaso Final",
    desc: "Integración de todo el curso para el examen final.",
    content: String.raw`**Mapa del curso:**
1. **Funciones** → base para modelar.
2. **Límites** → definen continuidad y derivada.
3. **Derivadas** → razón de cambio, optimización, velocidades relacionadas.
4. **Integrales** → acumulación, áreas y ecuaciones diferenciales.

**Conexión clave (TFC):** derivar e integrar son procesos inversos.

**Estrategia para el examen:**
- Lee el problema e identifica si pide **ritmo de cambio** (derivada) o **acumulación** (integral).
- Escribe la fórmula general antes de sustituir números.
- Revisa unidades y signos (un área no puede ser negativa).
- Practica con **Active Recall**: intenta resolver sin mirar la solución y luego compara.`,
    quiz: {
      title: "Evaluación: Repaso Final",
      qs: [
        { q: "Un problema pide 'la cantidad total de agua acumulada' a partir de un caudal. ¿Qué herramienta usas?", opts: ["Derivada", "Integral", "Límite al infinito", "Linealización"], ans: 1, exp: "Acumular una tasa de cambio es integrar." },
        { q: "¿Cuánto vale d/dx ∫₀ˣ eᵗ dt?", opts: ["eˣ − 1", "eˣ", "x·eˣ", "1"], ans: 1, exp: "Por el TFC parte 1, la derivada devuelve el integrando: eˣ." },
        { q: "¿Cuánto vale ∫₀^π sin x dx?", opts: ["0", "1", "2", "π"], ans: 2, exp: "[−cos x] de 0 a π = −(−1) − (−1) = 2." },
        { q: "¿Cuánto vale lím (h→0) [(2 + h)³ − 8]/h?", opts: ["8", "12", "6", "0"], ans: 1, exp: "Es la derivada de x³ en x = 2: 3·2² = 12." },
      ],
    },
  },
];
