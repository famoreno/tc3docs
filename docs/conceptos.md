# Conceptos generales (WIP)

## Leyenda

- **CD**: Clic derecho del ratón
- **CI**: Clic izquierdo del ratón
- **DCI**: Doble clic izquierdo del ratón
- **TC3**: TwinCAT3
- **CV**: Campus Virtual
- **FB**: Bloque funcional (*Functional Block*)

---

## Creación de proyectos en TwinCAT3

### Crear un proyecto de TwinCAT3

1. Abrir el *software* `Twincat XAE Shell`, desde el menú **Inicio** de Windows o desde el icono de la barra de programas en segundo plano que hay abajo a la derecha en la barra de tareas.
2. Seleccionar **New TwinCAT Project**.

    ![Imagen](images/cb/image.png){width=240px}

3. Seleccionar el tipo **TwinCAT XAE Project (XML format)**.

    ![Imagen](images/cb/image%201.png){width=384px}

4. Darle un nombre a la **Solución**, y seleccionar su ubicación (la que viene por defecto está bien). Dejar marcada la opción **Create directory for solution**.  
   **Ejemplo**: `TC3_Lampara`

    ![Imagen](images/cb/image%202.png){width=768px}

5. Por defecto, tanto la **Solution** de Visual Studio como el proyecto de **TC3** tendrán el mismo nombre.

> **<u>Recomendación</u>**: Ocultar las secciones del proyecto que no se van a utilizar: `MOTION`, `SAFETY`, `C++`, `VISION`, `ANALYTICS`. Nos quedaremos solo con `SYSTEM`, `PLC` e `I/O`.

### Crear un proyecto PLC

1. Una vez creado un proyecto de TC3, procedemos a crear un proyecto PLC.
2. Hacer **CD** sobre la sección `PLC` y seleccionar **Add New Item**.
3. Seleccionar **Standard PLC Project**, darle un nombre y pulsar **Add**.  
   **Ejemplo**: `Lampara_PLC`

    ![Imagen](images/cb/image%203.png){width=384px}

4. En la sección de `SYSTEM > Tasks` aparecerá por defecto una nueva tarea `PLC Task` con sus parámetros por defecto (ej. 10 ms de ciclo).
5. En la sección `PLC` aparece el proyecto con dos secciones nuevas:
    1. `Project`
          1. `External Types`. Almacena definiciones de tipos de datos externos que provienen de fuentes externas al PLC.
          2. `References`. Listado de referencias a las librerías utilizadas en el proyecto.
          3. `DUTs`. Tipos de Dato de Usuario (Data User Types) (`ENUM`, `STRUCT`).
          4. `GVLs`. Listas de Variables Globales (Global Variables Lists).
          5. `POUs`. Unidades de Organización del Programa (Program Organization Units). Programas, bloques funcionales y funciones que implementaremos.
          6. `VISUs`. Visualizaciones creadas.
          7. Tarea creada (`PLCTask`) y programa `MAIN`
   
            ![Imagen](images/cb/image%204.png){width=132px}
    
    2. `Instance`. Aquí aparecerán las variables en las imágenes de Entrada y Salida.
 
6. **A partir de aquí se puede empezar a implementar el proyecto.**

### Crear un bloque funcional

1. Hacer **CD** sobre la sección `POUs`.
2. Seleccionar `Add → POU → Functional Block`.
3. Darle un nombre significativo.
4. Seleccionar el lenguaje a utilizar. Normalmente utilizaremos `ST` o `SFC`.

#### Structured Text (ST)

- Es recomendable acceder a la ayuda y documentación que ofrece Beckhoff en su portal **[Infosys](https://infosys.beckhoff.com/)**.
- Las **instrucciones** deben terminar con `;`.
- Los **comentarios** se pueden realizar con `//` hasta final de línea o metiendo el texto entre `(*` y `*)`.
- La **asignación** de valores entre variables se realiza con el operador `:=`.
- La **comparación** de valores se realiza con los operadores `=`, `<>`, `<=`, `>=`.
- Las **operaciones lógicas** se realizan con los operadores `AND`, `OR` y `NOT`.
- Las **estructuras de control** básicas son:
    - Condicionales (`if`, `case`)
        ```st
        IF <condition> THEN
            <statements>
        ELSIF <condition> THEN
            <statements>
        ELSE
            <statements>
        END_IF;

        CASE <expression> OF
            <value>, <value>, …, <value>: <statements>
        ELSE
            <statements>
        END_CASE;
        ```
    - Bucles (`for`, `while`, `repeat`)
        ```st
        FOR <variable> := <expression> TO <expression> BY <expression> DO
            <statements>
        END_FOR;

        WHILE <condition> DO
            <statements>
        END_WHILE;

        REPEAT
            <statement>
        UNTIL <condition>
        END_REPEAT;
        ```
- La llamada a los **FBs** se realiza escribiendo el nombre de la instancia del **FB** seguido de, entre paréntesis, las asignaciones de los valores para las variables de entrada (si las hay), separadas por comas: `<nombre_instancia>(var1:=val1, var2:=val2, ...);`
- En caso de que no haya ninguna variable de entrada que especificar, simplemente se abre y se cierra paréntesis.  
  **Ejemplos**: `Estacion();` `Lampara(TiempoEncedido:=T#2s);`

#### Sequential Function Chart (SFC)

- **Reglas sintácticas básicas**:
    - Los nombres de las etapas no pueden empezar por un número. Tampoco pueden tener espacios, puntos u otros caracteres especiales como eñes, interrogaciones, etc. Sí permite guiones bajos.
    - No puede haber dos etapas consecutivas ni dos transiciones consecutivas. Hay que tener especial atención a esto cuando se produzcan bifurcaciones o saltos.

- **Añadir un etapa y una transición**:
    - Hacer **CD** sobre la **etapa** donde queramos introducir una nueva y seleccionar **Add step-transition** o **Add step-transition after**, dependiendo de si queremos añadirla antes o después, respectivamente, de la etapa seleccionada.
    - **<u>Importante</u>**: Comprobar que no quedan dos etapas o dos transiciones consecutivas. En caso contrario, borrar aquello que no sirva (**CI** sobre él y pulsar *Supr*).

- **Asociar una acción a una etapa**:
    - Asociar una acción **no memorizada** a un etapa
        - Hacer **CD** sobre la **etapa** a la que queramos asociar una acción no memoriza (o continua) y seleccionar **Insert action association** o **Insert action association after**, dependiendo de si queremos insertarla antes o después de las ya existentes (si las hay).
        - En la caja de la acción aparece en primer lugar el **modificador** (por defecto `N`, que significa **No memorizada**) y en segundo lugar el hueco donde debemos poner la acción a realizar (una variable booleana que queramos activar o una acción más compleja definida como acción asociada al bloque funcional).
      
            ![Imagen](images/cb/image%205.png)

            - Tipos de modificadores de acciones
                - **<u>Importante</u>**: Usaremos, por defecto, las acciones no memorizadas, aunque se pueden usar las otras si tiene sentido para el proyecto.
                - `N`: No memorizada (o continua): se ejecuta/activa mientras la etapa esté activa.
                - `R0` (Reinicio): la acción se desactiva.
                - `S0` (Activación): la acción se ejecuta/activa cuando se activa la etapa y continúa activa aunque la etapa se desactive.
                - `L` (Limitada): la acción se ejecuta/activa cuando se activa la etapa y se desactiva cuando se desactiva la etapa o se alcanza el tiempo especificado.
                - `D` (Retrasada): la acción se ejecuta/activa un tiempo después de que se active la etapa y se desactiva cuando se desactiva la etapa.
                - `P` (Pulsada): la acción se ejecuta 2 veces, cuando se activa la etapa y una vez más en el ciclo siguiente.
                - `SD` (Activación con retardo): se activa aunque la etapa ya no esté activa.
                - `DS` (Retardo de activación): se activa solo sí la etapa permanece activa.
                - `SL` (Activación limitada)

    - Asociar una **acción de entrada o salida** a un etapa
        - Podemos crear acciones con activación **a la entrada** o **a la salida** de una etapa.
        - Estas acciones se implementan en alguno de los lenguajes de la norma y permiten realizar acciones que se ejecutan **solo una vez** durante la etapa, en lugar de hacerse de manera continua.
        - **<u>Importante</u>**: Nada impide que una etapa tenga asociadas una o varias acciones no memorizadas, una con activación a la entrada y otra con activación a la salida.
            - **A la entrada**
                - Las acciones con activación a la **entrada** se ejecutan solo una vez **inmediatamente después** de entrar en la etapa donde se asocian. **Posteriormente** se comprueba si la condición de transición para pasar a la siguiente etapa es cierta o no.
                - Normalmente usaremos estas acciones para inicializar variables memorizadas, actualizar contadores, etc.
                - Para crear una de este tipo, hacer **CD** sobre la etapa donde la queremos asociar y seleccionar **Add entry action**.
                - Aparece un popup donde se nos pregunta por el nombre que le queremos poner y el lenguaje a utilizar. Se recomienda dejar el nombre por defecto (`S0_entry` en la figura) ya que nos indica en qué etapa está y de qué tipo es.
                    ![Imagen](images/cb/image%206.png)
                - En nuestros proyectos, **estas acciones siempre serán en ST**, pero podrían ser implementadas en cualquier otro lenguaje de la norma.
                - Una vez creada, aparece en el SFC como un cuadrado con una E en la esquina inferior izquierda de la etapa.
                    ![Imagen](images/cb/image%207.png)
            - **A la salida**
                - Las acciones con activación **a la salida** se ejecutan solo una vez inmediatamente antes de pasar a la siguiente etapa. Esto implica que **antes** de que se ejecute esta acción, la condición de transición para pasar a la siguiente etapa **debe ser cierta**.
                - Normalmente usaremos estas acciones para inicializar variables memorizadas, actualizar contadores, etc.
                - Para crear una de este tipo, hacer **CD** sobre la etapa donde la queremos asociar y seleccionar **Add exit action**.
                - Aparece un *popup* donde se nos pregunta por el nombre que le queremos poner y el lenguaje a utilizar. Se recomienda dejar el nombre por defecto (`S0_exit` en la figura) ya que nos indica en qué etapa está y de qué tipo es.
                    ![Imagen](images/cb/image%208.png)
                - En nuestros proyectos, **estas acciones siempre serán en ST**, pero podrían ser implementadas en cualquier otro lenguaje de la norma.
                - Una vez creada, aparece en el SFC como un cuadrado con una **E** en la esquina inferior izquierda de la etapa.
                    ![Imagen](images/cb/image%209.png)
    - Asociar una **acción principal** a un etapa <font color="#FF0000">[TODO]</font>
---

## Estructuras de evolución básicas

### Secuencia básica

- Una secuencia básica se compone de una **sucesión lineal de etapas y transiciones**, donde las primeras se van a ir ejecutando en secuencia conforme las condiciones asociadas a las segundas se vayan cumpliendo.

- Normalmente, al final de la secuencia se producirá un salto hacia atrás (o el inicio) en el programa.

    ![Imagen](images/cb/image%2010.png)

- Para insertar un salto detrás de una transición, hay que hacer **CD** sobre la transición y seleccionar **Insert jump after**. Solo hay que indicar el nombre de la etapa a la que queremos saltar.

### Bifurcación

- Tras una etapa podemos realizar una **bifurcación** en distintas ramas en función de distintas condiciones. Esto nos permite dirigir la secuencia por cambio si ocurre un evento y por otros distintos si ocurren otros eventos.

- En el ejemplo de la figura, si la etapa `Init` está activa y se activa `Execute`, el programa evolucionará por la rama de la izquierda llegando a `S0`. Si lo que se activa es `Restore`, el programa evolucionará por la derecha pasando a `Sr` y, una vez se active `Restaurado`, la secuencia pasará a `S0`.

    ![Imagen](images/cb/image%2011.png)

- Para realizar una bifurcación, hacer **CD** sobre la **transición** donde se quiera hacer la bifurcación (`Execute` en el ejemplo) y seleccionar **Insert branch right**.

- Nada impide que se pueda hacer una bifurcación con más de dos ramas.

- Es recomendable que las condiciones de la bifurcación sean excluyentes pero nada impide que no lo sean. El programa tomará el camino de la primera transición cuya condición sea verdadera.

- Si ocurriera que varias o todas las condiciones son verdaderas a la vez, el programa evolucionará por la rama de la izquierda. **No obstante, esto suele indicar que hay un mal diseño en el programa.**

### Paralelismo

- Si queremos que el programa evolucione por dos secuencias en paralelo (se ejecutan simultáneamente) podemos incluir un paralelismo en el código.

- En el ejemplo de la figura, si la etapa `Init` está activa y se activa `Execute`, el programa evolucionará por ambas ramas a la vez, activando los estados `S0` y `Sr` de manera simultánea (y por tanto, `LuzRoja` y `Restaura`).

    ![Imagen](images/cb/image%2012.png)

- En la transición con condición `NOT Pulsador OR S0.t>T#5s` se produce un punto de sincronización ya que, para que el programa evolucione a `S1` debe ocurrir que `S0` y `Sr2` estén activas y, además, que la condición `NOT Pulsador OR S0.t>T#5s` sea cierta. Por tanto, podemos decir que el programa *esperará* hasta que termine la rama de la derecha antes de evolucionar.

---

## Crear una visualización

- Hacer **CD** sobre la sección `VISUs`.

- Seleccionar `Add → Visualization` y pulsar en **Open** en la ventana *popup*.

    ![Imagen](images/cb/image%2013.png)

- En la parte derecha de la pantalla aparecerá la sección `Toolbox` donde, en la sección `Basic` aparecen las formas básicas. Arrastrar a la visualización los elementos que se quieran.

- **<u>Importante</u>**: Si no aparece la sección, mostrarlo entrando en el **Menú** `View → Toolbox`.

- Se recomienda utilizar **rectángulos** para crear botones tanto para las entradas como para las salidas.

### Botones para cambiar valores de variables

- Dibujar un rectángulo con el tamaño deseado

- Escribir dentro la etiqueta que queramos que aparezca en el botón

- Introducir la variable de tipo `BOOL` que queremos asociar a dicho botón. Dependiendo del comportamiento que queramos que tenga el botón, esta variable se introduce en una sección distinta dentro de `Properties → Input Configuration` (la pestaña `Properties` aparece a la derecha, normalmente combinada con `Toolbox`).

    - Si queremos que la variable cambie de valor **mientras** se pulsa el botón con el ratón pero vuelva a su valor anterior una vez soltado el ratón, introduciremos la variable en la sección `Tap`:

        ![Imagen](images/cb/image%2014.png)

    - Si queremos que la variable cambie de valor cada vez que pulsemos el botón (el valor conmutará entre `TRUE` y `FALSE`) lo introduciremos en la sección `Toggle`:

        ![Imagen](images/cb/image%2015.png)

---

## Declaración de variables en TwinCAT3

- Se recomienda utilizar la convención **[CamelCase](https://es.wikipedia.org/wiki/Camel_case)** para declarar las variables.
- La sintaxis para la declaración de variables es la siguiente:

```st
<NombreVariable> : <tipo> [:=<ValorInicial>]
```

### Ejemplos

```st
// bool
Pulsador: BOOL;
LuzAmarilla: BOOL := TRUE;

// enteros con y sin signo
Altura: INT;
Contador: UINT;
UnidadesSolicitadas: UINT := 10;

// números reales
TpoSegundos: FLOAT := 1.2;

// tiempo
TiempoEspera: TIME := T#2s;
TiempoRestante: TIME;

// bloques funcionales
Flanco_Pulsador: R_TRIG; // detector de flanco (estándar)
Coordinador: FB_Coordinador; // bloque funcional definido por el usuario

// arrays
Ocupado: ARRAY[0..3] OF BOOL; // array de cuatro elementos de tipo BOOL; acceso con []
```

---

## Exportar e importar POUs y VISUs entre proyectos

1. Podemos exportar `POUs` y `VISUs` desde una solución de **TC3** e importarla de nuevo en otra distinta. De esta manera podemos reutilizar código de distintas proyectos.
2. Para realizar esto, en la solución origen, simplemente hay que hacer **CD** sobre el `POU` o `VISU` a exportar y seleccionar **Export to ZIP**. Se selecciona donde guardar el archivo exportado y se pulsa **Save**.
3. Posteriormente, en la solución destino, hacer **CD** sobre la carpeta `POU` o `VISU` y seleccionar **Import from ZIP**. Se busca el archivo correspondiente y se pulsa **OK**.

---

## Guardar y llevar el proyecto a otro equipo

### Usando la carpeta completa

1. Es la manera más sencilla de llevarse un proyecto desde un equipo a otro.
2. Solo hay que copiar la carpeta raíz en un *pendrive* y pegar la carpeta en el equipo destino.
3. Posteriormente, hacer **DCI** sobre el fichero de *Solution* (`.sln`) para que se abra de nuevo en TC3.

> **Importante**: Si la carpeta ha sido comprimida para ser trasladada, hay que asegurarse de haber descomprimido la carpeta completa en el destino antes de abrir el proyecto.

### Exportando como .tnzip

1. Este proceso genera el mínimo tamaño posible para trasladar un proyecto.
2. Seleccionar `File → Save [nombre_del_proyecto] as Archive…`.
3. Seleccionar dónde guardar el proyecto, darle un nombre y asegurarse de que el formato es de tipo `.tnzip`.
4. Para volver a abrir el proyecto:
   - Abrir TC3.
   - Seleccionar `File → Open → Solution from Archive…`.
   - Buscar el archivo `.tnzip`.
   - Seleccionar (o crear si no existe) una carpeta donde se va a generar la *Solution*.
   - En principio, se puede seleccionar siempre la misma carpeta cada vez que se repita este procedimiento.

---

## Convenciones para nombrar (y renombrar) elementos

- Se recomienda llamar a todos los elementos del proyecto con el nombre adecuado **desde el principio**, ya que renombrar *a posteriori* puede acarrear problemas derivados del acceso a elementos cuya ruta ha cambiado. No obstante, si es necesario renombrar los elementos, el procedimiento es como sigue.

### Soluciones

- Se recomienda llamar a las soluciones de TC3 de la misma forma que los Proyectos de TC3.
- Para renombrarlo una vez creado:
  1. **CD** sobre el nombre de la solución y seleccionar **Rename**.
  2. Escribir el nuevo nombre.

### Proyectos TwinCAT3

- Se recomienda llamar a los proyectos TwinCAT3 de la siguiente forma:
  - **Para los ejemplos**: `TC3_[nombre]`  
    donde el nombre debe ser algo significativo.  
    **Ejemplos**: `TC3_Lampara`, `TC3_Carro`, etc.
  - **Para los trabajos finales**: `[codigo]_TC3_G[grupo]`  
    donde `codigo` debe escogerse según la asignatura (`AIM`, `AIE`, `SR`, etc.) y `grupo` debe ser el número del grupo con dos dígitos (`01`, `02`, …).  
    **Ejemplos**: `AIM_TC3_G01`, `SR_TC3_G12`, etc.

---

## Ejecutar un programa en TwinCAT3

1. Una vez el programa está implementado (independientemente del lenguaje utilizado):
   - Compilar el proyecto: Menú `Build → Build [nombre del proyecto]`.
   - Asegurarse de que no hay errores.
2. Activar la configuración en el `Target` (**Activate Configuration**) y activar el modo de ejecución (**Run Mode**). Esto último te lo pregunta TwinCAT3 en una ventana *popup*.
3. Descargar el programa en el `Target` (**Login**), donde se preguntará, en un *popup*, si quieres crear un puerto de comunicación con el `Target` y descargar el programa. Pulsar en **Yes**.
4. Ejecutar el programa (**Start**).

> **Importante**: Para poder modificar de nuevo el programa, primero hay que parar el programa (**Stop**) [**recomendado**] y posteriormente hacer **Logout**.

---

## Activar/desactivar el *hardware*

1. Si has vinculado las variables de tu programa con el **equipo remoto** (hiciste la búsqueda del equipo remoto y la exploración de los módulos de E/S), cuando quieras probar tu programa en el **Runtime Local**, aparecerá una ventana *popup* indicando un error.
2. Esto se debe a que TC3 quiere establecer conexión con el *hardware* al que estuviste conectado pero no puede, ya que el `Target` es el local.
3. Para evitar esto, solo tienes que deshabilitar el *hardware* haciendo **CD** sobre el dispositivo buscado y seleccionar **Disable**.

> **Importante**: Recuerda volver a habilitarlo cuando quieras volver a usar el equipo remoto.

---

## Búsqueda de equipos remotos

- Hay un video de ejemplo en el Campus Virtual en *Automatización > Videos > TC3* con nombre `9_Runtime_Target_*.mkv`.

---

## Enlace de variables y terminales de E/S

- Hay un video de ejemplo en el Campus Virtual en *Automatización > Videos > TC3* con nombre `9_Runtime_Target_*.mkv`.