import { CaseSpec } from './caseBuilder';

// Casos basados en los pacientes del Baynes · Glucosa, músculo y energía

export const BAYNES_CASES_2: CaseSpec[] = [
  {
    id: 'case_baynes_von_gierke_01',
    title: 'Alba R. (8 meses): Barriga grande y sudores si pasa más de tres horas sin comer',
    system: 'metabolic',
    difficulty: 'avanzado',
    summary:
      'Alba R., un bebé de 8 meses, se pone irritable, sudorosa y temblorosa si pasan más de tres horas entre tomas. Sus padres han notado que tiene la tripa cada vez más grande y la cara redonda. Esta mañana, tras dormir toda la noche, estaba casi sin reaccionar. Su hígado almacena glucógeno, pero no puede liberarlo como glucosa.',
    glossary: [
      ['Glucógeno', 'Forma de almacenar glucosa en el hígado y el músculo. El hígado lo usa para mantener la glucemia entre comidas.'],
      ['Glucosa-6-fosfatasa', 'Enzima del hígado que quita el fosfato a la glucosa para que pueda salir a la sangre. Es el último paso de la glucogenólisis y de la gluconeogénesis.'],
      ['Hepatomegalia', 'Hígado más grande de lo normal.'],
    ],
    concept:
      '1. Entre comidas, el hígado rompe glucógeno y fabrica glucosa nueva -> 2. Ambas rutas terminan en glucosa-6-fosfato -> 3. Sin glucosa-6-fosfatasa la glucosa no puede salir a la sangre -> 4. Hipoglucemia a las pocas horas de ayuno -> 5. La glucosa-6-fosfato atrapada se desvía a lactato, grasas y ácido úrico, y el glucógeno se acumula en el hígado.',
    patient: { age: 0, ageLabel: '8 meses', gender: 'Femenino' },
    complaint: 'Decaimiento importante al despertar, tras toda la noche sin comer.',
    illness:
      'Alba R. ha empezado a dormir toda la noche sin tomas. Desde hace dos meses, si se retrasa una toma, se pone irritable, pálida y sudorosa, y mejora enseguida al comer. Esta mañana, tras unas 8 horas de ayuno, estaba muy adormilada y respiraba rápido. Sus padres notan que la barriga le ha crecido mucho y que tiene las mejillas muy redondas.',
    history: ['Embarazo y parto normales', 'Peso y talla por debajo de lo esperado en las últimas revisiones'],
    meds: ['Ninguno'],
    lifestyle: 'Alimentación con fórmula y papillas cada 3 horas durante el día.',
    vitals: ['82/48 mmHg', '160 lpm', '44 rpm', '36.2 °C', '98%'],
    exam: [
      ['Aspecto', 'Cara de muñeca (mejillas muy redondas). Adormilada.'],
      ['Abdomen', 'Muy distendido, con hígado que llega hasta la pelvis, liso y no doloroso. Bazo no palpable.'],
    ],
    labs: [
      ['Glucemia', '28', 'mg/dL', '60 - 100 (hipoglucemia grave)'],
      ['Lactato', '7.8', 'mmol/L', '0.5 - 2.0 (muy alto)'],
      ['Triglicéridos', '640', 'mg/dL', '< 150'],
      ['Ácido úrico', '9.2', 'mg/dL', '2.0 - 5.5'],
      ['Cuerpos cetónicos en orina', 'Negativos o trazas', '', 'Positivos tras 8 h de ayuno en un lactante sano'],
      ['Prueba de glucagón con glucemia y lactato', '[NO SOLICITADO - Prueba funcional a pedir por el clínico]', '', 'La glucemia sube > 30 mg/dL'],
    ],
    target: 'Glucogenosis tipo I (enfermedad de von Gierke)',
    targetWhy:
      'Lactante con hipoglucemia tras pocas horas de ayuno, hígado muy grande, cara de muñeca, y lactato, triglicéridos y ácido úrico elevados.',
    differentials: [
      ['Déficit de MCAD (oxidación de ácidos grasos)', 'Da hipoglucemia sin cetonas al ayunar, pero solo tras ayunos largos o infecciones, sin hepatomegalia gigante ni lactato tan alto.'],
      ['Hiperinsulinismo congénito', 'Causa hipoglucemias graves, pero sin hepatomegalia ni acidosis láctica.'],
      ['Glucogenosis tipo III (déficit de enzima desramificante)', 'Se parece, pero es más leve, el lactato y el úrico suelen ser normales y las transaminasas y la CK suben.'],
    ],
    correct: [
      'bm_glucagon_test',
      'Prueba de glucagón con glucemia y lactato',
      'El glucagón ordena al hígado romper glucógeno: si la glucemia no sube y el lactato sí, la glucosa está atrapada dentro del hepatocito.',
      'Prueba funcional sencilla que localiza el defecto; se confirma con el estudio genético.',
    ],
    distractors: [
      ['bm_perfil_acilcarnitinas', 'Perfil de acilcarnitinas', 'Detecta los defectos de oxidación de ácidos grasos.', 'Sería la prueba si sospecháramos un déficit de MCAD; aquí será normal.'],
      ['bm_peptido_c', 'Péptido C e insulina', 'Indican cuánta insulina fabrica el páncreas.', 'Estarán bajos en la hipoglucemia: descartan hiperinsulinismo pero no explican la causa.'],
      ['bm_amonio_plasmatico', 'Amonio plasmático', 'Marcador de los defectos del ciclo de la urea.', 'No hay vómitos ni encefalopatía que sugieran hiperamonemia.'],
    ],
    key:
      'La glucosa-6-fosfatasa está en el retículo endoplásmico del hígado y del riñón, pero no en el músculo: por eso el glucógeno muscular solo sirve al propio músculo. Si falta, el hígado no puede aportar glucosa ni desde el glucógeno ni desde la gluconeogénesis. La glucosa-6-fosfato que se acumula sigue la glucólisis hasta lactato, alimenta la síntesis de grasas y la vía de las pentosas (más purinas y más ácido úrico). El tratamiento es evitar el ayuno: tomas frecuentes y almidón de maíz crudo, que se digiere despacio.',
    category: 'Glucogenólisis y gluconeogénesis hepáticas',
    pathway: 'Glucógeno / gluconeogénesis -> glucosa-6-fosfato -> [glucosa-6-fosfatasa, DÉFICIT] -> glucosa libre en sangre',
    alteration: 'Variantes del gen G6PC con déficit de glucosa-6-fosfatasa',
  },
  {
    id: 'case_baynes_mcardle_01',
    title: 'Óscar M. (17 años): Calambres en los primeros minutos de correr y orina oscura tras el gimnasio',
    system: 'neuromuscular',
    difficulty: 'intermedio',
    summary:
      'Óscar M., estudiante de 17 años, siempre ha sido «el lento» en educación física. A los pocos minutos de correr o subir escaleras deprisa le duelen y se le endurecen los músculos, pero si para y descansa un poco, puede seguir. Tras una sesión de pesas, su orina se volvió color coca-cola. Sus músculos no pueden usar su propio glucógeno.',
    glossary: [
      ['Glucógeno fosforilasa muscular', 'Enzima que rompe el glucógeno del músculo para obtener glucosa-1-fosfato y energía durante el ejercicio.'],
      ['Mioglobinuria', 'Orina oscura por mioglobina que sale de las fibras musculares dañadas.'],
      ['Segundo aliento', 'Mejoría tras unos minutos de descanso, cuando el músculo empieza a usar glucosa de la sangre y ácidos grasos.'],
    ],
    concept:
      '1. Al empezar un ejercicio intenso, el músculo usa su glucógeno -> 2. Sin fosforilasa muscular no puede romperlo -> 3. Falta ATP y no se produce lactato -> 4. Calambres, dolor y daño de fibras (sale CK y mioglobina) -> 5. Tras descansar, llegan glucosa y grasas por la sangre y el músculo puede seguir (segundo aliento).',
    patient: { age: 17, gender: 'Masculino', occupation: 'Estudiante de bachillerato' },
    complaint: 'Dolor y rigidez muscular a los pocos minutos de ejercicio; orina oscura ayer tras el gimnasio.',
    illness:
      'Óscar M. recuerda que desde niño se cansa mucho antes que sus compañeros. A los 2-3 minutos de correr o de levantar peso nota dolor, calambres y los músculos duros. Ha aprendido que si para 5-10 minutos puede seguir caminando sin problema. Ayer, en su primera sesión de gimnasio, siguió a pesar del dolor; por la noche la orina era oscura y hoy le duelen mucho los muslos y los brazos.',
    history: ['Sin enfermedades previas'],
    meds: ['Ninguno'],
    lifestyle: 'Quiere apuntarse a un gimnasio. No toma suplementos.',
    vitals: ['118/72 mmHg', '76 lpm', '14 rpm', '36.6 °C', '99%'],
    exam: [
      ['Aparato locomotor', 'Músculos de muslos y brazos doloridos al presionar. Fuerza conservada en reposo.'],
      ['Orina', 'Color pardo oscuro.'],
    ],
    labs: [
      ['Creatina quinasa (CK)', '12.400', 'U/L', '< 200 (daño muscular)'],
      ['Tira de orina', 'Sangre +++ sin hematíes en el microscopio', '', 'Negativa (es mioglobina, no sangre)'],
      ['Creatinina', '0.9', 'mg/dL', '0.7 - 1.3'],
      ['Glucemia', '92', 'mg/dL', '70 - 110 (normal: el hígado funciona bien)'],
      ['Prueba de ejercicio del antebrazo con lactato y amonio', '[NO SOLICITADO - Prueba funcional a pedir por el clínico]', '', 'Lactato y amonio suben 3-5 veces'],
    ],
    target: 'Glucogenosis tipo V (enfermedad de McArdle)',
    targetWhy:
      'Intolerancia al ejercicio desde la infancia con calambres en los primeros minutos, mejoría tras descansar (segundo aliento) y mioglobinuria tras un esfuerzo intenso, con glucemia normal.',
    differentials: [
      ['Déficit de carnitina palmitoiltransferasa II (CPT II)', 'También da mioglobinuria, pero tras ejercicios largos o ayuno, no en los primeros minutos, y sin segundo aliento.'],
      ['Rabdomiólisis por sobreesfuerzo en una persona sana', 'Puede pasar en la primera sesión de gimnasio, pero Óscar tiene síntomas desde niño con esfuerzos pequeños.'],
      ['Distrofia muscular', 'Produce debilidad progresiva en reposo, no síntomas solo con el ejercicio.'],
    ],
    correct: [
      'bm_test_ejercicio_lactato',
      'Prueba de ejercicio del antebrazo con lactato y amonio',
      'Si el lactato no sube y el amonio sí, el músculo trabaja pero no consigue degradar glucógeno.',
      'Prueba funcional que localiza el defecto en la glucogenólisis muscular; se confirma con estudio genético.',
    ],
    distractors: [
      ['bm_ck_total', 'Creatina quinasa', 'Enzima que sale del músculo dañado.', 'Confirma el daño muscular, pero lo producen muchas enfermedades; no indica la causa.'],
      ['bm_perfil_acilcarnitinas', 'Perfil de acilcarnitinas', 'Detecta defectos de oxidación de grasas.', 'Sería útil si los síntomas aparecieran en ejercicios largos o en ayunas.'],
      ['bm_glucosa', 'Glucemia', 'Glucosa en sangre.', 'Normal: el glucógeno del hígado usa otra fosforilasa y funciona bien.'],
    ],
    key:
      'Hígado y músculo tienen glucógeno fosforilasas distintas (isoenzimas codificadas por genes diferentes). En McArdle falta la del músculo: el hígado mantiene la glucemia, pero el músculo no puede usar su reserva al inicio del ejercicio. El amonio sube porque, sin ATP suficiente, el músculo degrada AMP a IMP y amonio. Tomar algo de azúcar antes del ejercicio y calentar despacio ayuda. Ignorar el dolor puede llevar a una rabdomiólisis con fallo renal.',
    category: 'Glucogenólisis muscular durante el ejercicio',
    pathway: 'Glucógeno muscular -> [glucógeno fosforilasa muscular, DÉFICIT] -> glucosa-1-fosfato -> glucólisis -> ATP + lactato',
    alteration: 'Variantes del gen PYGM con déficit de fosforilasa muscular',
  },
  {
    id: 'case_baynes_glut1_01',
    title: 'Martina O. (10 meses): Convulsiones antes del desayuno y retraso al sentarse',
    system: 'neuromuscular',
    difficulty: 'experto',
    summary:
      'Martina O., de 10 meses, tiene episodios de mirada fija y sacudidas, casi siempre por la mañana antes de comer. Todavía no se sienta sola. Los antiepilépticos no le funcionan. Su glucosa en sangre es normal, pero su cerebro no recibe suficiente glucosa.',
    glossary: [
      ['GLUT-1', 'Transportador que permite a la glucosa atravesar la barrera hematoencefálica y entrar en el cerebro.'],
      ['Barrera hematoencefálica', 'Capa de células de los capilares cerebrales que controla qué sustancias pasan de la sangre al cerebro.'],
      ['Líquido cefalorraquídeo (LCR)', 'Líquido que baña el cerebro y la médula. Se obtiene con una punción lumbar.'],
    ],
    concept:
      '1. El cerebro depende casi por completo de la glucosa -> 2. Para llegar a él, la glucosa necesita el transportador GLUT-1 -> 3. Con poco GLUT-1, la glucosa del cerebro está baja aunque la de la sangre sea normal -> 4. Las neuronas no tienen energía: convulsiones y retraso del desarrollo -> 5. Los cuerpos cetónicos entran por otro transportador y pueden alimentar al cerebro.',
    patient: { age: 0, ageLabel: '10 meses', gender: 'Femenino' },
    complaint: 'Episodios de desconexión con sacudidas, sobre todo por la mañana.',
    illness:
      'Martina O. empezó hace 4 meses con episodios de mirada fija, movimientos de los ojos y sacudidas de los brazos que duran un minuto. Pasan casi siempre al despertar, antes de la primera toma, y son menos frecuentes después de comer. Ha probado dos antiepilépticos sin mejoría. Todavía no se sienta sola y sostiene mal la cabeza. No ha tenido fiebre.',
    history: ['Embarazo y parto normales', 'Perímetro de la cabeza en el límite bajo'],
    meds: ['Levetiracetam', 'Ácido valproico (sin respuesta)'],
    lifestyle: 'Alimentación con papillas y fórmula.',
    vitals: ['88/54 mmHg', '124 lpm', '28 rpm', '36.7 °C', '99%'],
    exam: [
      ['Neurológico', 'Bajo tono muscular (hipotonía). No se sienta sin apoyo. Movimientos algo torpes al coger objetos.'],
      ['Cabeza', 'Perímetro craneal pequeño para su edad.'],
    ],
    labs: [
      ['Glucemia (extraída a la vez que la punción)', '88', 'mg/dL', '70 - 100 (normal)'],
      ['Lactato en sangre', '1.1', 'mmol/L', '0.5 - 2.0 (normal)'],
      ['Leucocitos en LCR', '1', '/µL', '< 5 (sin infección)'],
      ['Lactato en LCR', '1.0', 'mmol/L', '< 2.2 (normal)'],
      ['Glucosa en LCR y cociente LCR/sangre', '[NO SOLICITADO - Parámetro clave a pedir por el clínico]', 'mg/dL', 'LCR 45 - 80; cociente > 0.6'],
    ],
    target: 'Síndrome de déficit de GLUT-1',
    targetWhy:
      'Lactante con convulsiones que empeoran en ayunas y no responden a antiepilépticos, retraso del desarrollo y cabeza pequeña, con glucemia normal y sin signos de infección en el LCR.',
    differentials: [
      ['Meningitis bacteriana', 'También baja la glucosa del LCR, pero con fiebre, muchos leucocitos y lactato alto en el LCR.'],
      ['Hipoglucemia', 'Las convulsiones en ayunas podrían deberse a glucosa baja en sangre, pero aquí la glucemia es normal.'],
      ['Enfermedad mitocondrial', 'Puede dar epilepsia y retraso, pero con lactato alto en sangre y LCR.'],
    ],
    correct: [
      'bm_glucosa_lcr',
      'Glucosa en LCR con glucemia simultánea',
      'Un cociente bajo con glucemia normal demuestra que la glucosa no cruza bien hacia el cerebro.',
      'Es la prueba que orienta el diagnóstico; se confirma con el estudio del gen SLC2A1.',
    ],
    distractors: [
      ['bm_glucosa', 'Glucemia en sangre', 'Glucosa en la sangre.', 'Es normal: el problema no es la cantidad de glucosa sino su paso al cerebro.'],
      ['bm_lactato', 'Lactato', 'Producto de la glucólisis sin oxígeno.', 'Normal; sería útil si sospecháramos una enfermedad mitocondrial.'],
      ['bm_amonio_plasmatico', 'Amonio', 'Marcador de defectos del ciclo de la urea.', 'No hay vómitos ni otros datos de hiperamonemia.'],
    ],
    key:
      'Los transportadores GLUT funcionan por difusión facilitada: mueven la glucosa a favor de su gradiente sin gastar energía. Cada tejido tiene los suyos: GLUT-1 en hematíes y barrera hematoencefálica, GLUT-2 en hígado y páncreas, GLUT-4 en músculo y grasa (regulado por insulina). Con la mitad de GLUT-1 funcional, el cerebro no recibe suficiente glucosa. El tratamiento es una dieta cetogénica: muy rica en grasa y pobre en hidratos de carbono, para que el hígado fabrique cuerpos cetónicos, que entran al cerebro por otro transportador (MCT1).',
    category: 'Transporte de glucosa a través de membranas',
    pathway: 'Glucosa en sangre -> [GLUT-1 en la barrera hematoencefálica, DÉFICIT] -> glucosa en el cerebro -> glucólisis neuronal',
    alteration: 'Variante del gen SLC2A1 con la mitad de transportador funcional',
  },
  {
    id: 'case_baynes_melas_01',
    title: 'Celia J. (16 años): Migrañas, vómitos y un episodio de no ver por un lado',
    system: 'neuromuscular',
    difficulty: 'experto',
    summary:
      'Celia J., estudiante de 16 años, siempre ha sido bajita y se cansa enseguida al hacer deporte. Hoy, tras una semana de dolores de cabeza y vómitos, ha dejado de ver la mitad izquierda de lo que mira. Su madre tiene diabetes y sordera desde joven. Sus mitocondrias no producen bien la energía.',
    glossary: [
      ['Mitocondria', 'Orgánulo donde se produce la mayor parte del ATP mediante la cadena respiratoria. Tiene su propio ADN, que se hereda de la madre.'],
      ['Cadena respiratoria', 'Grupo de complejos de la membrana mitocondrial interna que pasan electrones hasta el oxígeno y bombean protones para fabricar ATP.'],
      ['Episodio pseudoictal', 'Síntomas parecidos a un ictus (pérdida de visión, de fuerza o de habla) causados por falta de energía en las neuronas, no por un vaso obstruido.'],
    ],
    concept:
      '1. Una mutación en el ADN mitocondrial altera la síntesis de proteínas de la cadena respiratoria -> 2. Las mitocondrias producen menos ATP -> 3. Las células recurren a la glucólisis y convierten el piruvato en lactato -> 4. Sube el lactato en sangre y en el LCR, sobre todo con el ejercicio -> 5. Los tejidos que más energía gastan (cerebro, músculo, oído) fallan antes.',
    patient: { age: 16, gender: 'Femenino', occupation: 'Estudiante de bachillerato' },
    complaint: 'Pérdida de la visión del lado izquierdo desde esta mañana, tras una semana de dolor de cabeza y vómitos.',
    illness:
      'Celia J. tiene migrañas desde los 12 años. Esta semana el dolor de cabeza ha sido diario, con vómitos. Esta mañana se ha chocado con la puerta porque no ve lo que tiene a la izquierda. Siempre ha sido la más baja de su clase y se agota enseguida en educación física, con dolores musculares. Su madre tiene diabetes y lleva audífonos desde los 30 años.',
    history: ['Talla baja', 'Migrañas desde los 12 años', 'Madre con diabetes y sordera'],
    meds: ['Ibuprofeno a demanda'],
    lifestyle: 'Evita el deporte porque se cansa mucho.',
    vitals: ['110/70 mmHg', '96 lpm', '22 rpm', '36.8 °C', '98%'],
    exam: [
      ['Neurológico', 'No ve la mitad izquierda del campo visual de ambos ojos (hemianopsia). Resto normal.'],
      ['General', 'Talla baja y poca masa muscular.'],
    ],
    labs: [
      ['Glucemia', '96', 'mg/dL', '70 - 110'],
      ['Gasometría venosa: pH / bicarbonato', '7.31 / 18', ' / mEq/L', '7.35-7.45 / 22-28 (acidosis metabólica)'],
      ['Creatina quinasa', '310', 'U/L', '< 170'],
      ['Resonancia magnética', 'Lesiones en el lóbulo occipital derecho que no siguen el territorio de ninguna arteria', '', 'Normal'],
      ['Lactato en sangre y LCR', '[NO SOLICITADO - Parámetro clave a pedir por el clínico]', 'mmol/L', '0.5 - 2.0'],
    ],
    target: 'Encefalomiopatía mitocondrial con acidosis láctica y episodios pseudoictales (MELAS)',
    targetWhy:
      'Adolescente con talla baja, intolerancia al ejercicio, migrañas y un episodio parecido a un ictus con lesiones cerebrales que no siguen el territorio de una arteria, acidosis metabólica y madre con diabetes y sordera (herencia materna).',
    differentials: [
      ['Ictus isquémico juvenil', 'Da los mismos síntomas, pero la lesión sigue el territorio de una arteria y no hay acidosis ni historia familiar materna.'],
      ['Migraña con aura', 'Puede dar alteraciones visuales, pero duran menos de una hora y no dejan lesiones en la resonancia.'],
      ['Enfermedad de McArdle', 'También da intolerancia al ejercicio, pero sin afectación cerebral y sin lactato alto (al contrario: el lactato no sube).'],
    ],
    correct: [
      'bm_lactato',
      'Lactato en sangre y en LCR',
      'Si la cadena respiratoria funciona mal, el piruvato se convierte en lactato en vez de entrar en la mitocondria.',
      'Es el parámetro bioquímico característico; se confirma con el estudio del ADN mitocondrial.',
    ],
    distractors: [
      ['bm_glucosa', 'Glucemia', 'Glucosa en sangre.', 'Normal; no explica el cuadro.'],
      ['bm_test_ejercicio_lactato', 'Prueba de ejercicio con lactato y amonio', 'Explora la glucogenólisis muscular.', 'Orientada a McArdle; en MELAS el lactato ya está alto en reposo.'],
      ['bm_troponin_c', 'Troponina', 'Marcador de daño cardíaco.', 'No aporta al diagnóstico neurológico.'],
    ],
    key:
      'El ADN mitocondrial codifica 13 proteínas de la cadena respiratoria y los ARN de transferencia necesarios para fabricarlas. En MELAS, la mutación más frecuente (m.3243A>G) afecta a un ARNt. Las mitocondrias se heredan solo de la madre, y cada célula tiene una mezcla de mitocondrias sanas y mutadas (heteroplasmia), lo que explica que la madre tenga solo diabetes y sordera. Cuando la cadena respiratoria falla, el NADH no se reoxida y el piruvato se reduce a lactato.',
    category: 'Cadena respiratoria y fosforilación oxidativa',
    pathway: 'Piruvato -> [cadena respiratoria con ARNt mitocondrial alterado] -> menos ATP -> NADH acumulado -> piruvato -> lactato',
    alteration: 'Mutación puntual del ADN mitocondrial (m.3243A>G en el gen del ARNt-Leu)',
  },
  {
    id: 'case_baynes_dinitrofenol_01',
    title: 'Rubén Z. (23 años): Fiebre de 41 °C y sudor a chorros con unas pastillas para adelgazar',
    system: 'metabolic',
    difficulty: 'avanzado',
    summary:
      'Rubén Z., de 23 años, compró por internet unas cápsulas «quemagrasas» para perder peso antes del verano. Hoy ha tomado el doble de la dosis. Llega a urgencias con 41 °C, sudando muchísimo, respirando rápido y con el corazón disparado. El producto hace que sus mitocondrias quemen combustible sin fabricar ATP.',
    glossary: [
      ['Desacoplante', 'Sustancia que deja pasar protones a través de la membrana mitocondrial interna sin pasar por la ATP sintasa. La energía se pierde en forma de calor.'],
      ['Gradiente de protones', 'Diferencia de concentración de H+ entre los dos lados de la membrana mitocondrial interna. La ATP sintasa lo usa para fabricar ATP.'],
      ['Hipertermia', 'Temperatura corporal muy alta que no se debe a una infección.'],
    ],
    concept:
      '1. La cadena respiratoria bombea protones y crea un gradiente -> 2. Normalmente los protones vuelven por la ATP sintasa y se fabrica ATP -> 3. El dinitrofenol los transporta de vuelta sin pasar por la ATP sintasa -> 4. La energía se pierde como calor y el ATP baja -> 5. Las células queman más glucosa y grasa, consumen más oxígeno y producen lactato: fiebre, sudor, taquicardia y acidosis.',
    patient: { age: 23, gender: 'Masculino', occupation: 'Monitor de gimnasio' },
    complaint: 'Mucho calor, sudoración intensa, palpitaciones y sensación de ahogo.',
    illness:
      'Rubén Z. toma desde hace tres semanas unas cápsulas amarillas compradas en una web extranjera que prometen «quemar grasa sin dieta». Ha perdido 4 kg. Esta mañana tomó dos cápsulas en vez de una. A las pocas horas empezó con mucho calor, sudor abundante, sed, palpitaciones y respiración rápida. No tiene tos ni dolor de garganta. Ha traído el bote, sin etiqueta en español.',
    history: ['Sin enfermedades previas'],
    meds: ['Cápsulas «quemagrasas» compradas por internet'],
    lifestyle: 'Entrena dos horas al día. Dieta alta en proteínas.',
    vitals: ['96/58 mmHg', '148 lpm', '32 rpm', '41.2 °C', '95%'],
    exam: [
      ['Piel', 'Caliente, roja y empapada en sudor. Tinte amarillento en palmas.'],
      ['Neurológico', 'Agitado pero orientado. Sin rigidez de nuca.'],
    ],
    labs: [
      ['Lactato', '6.4', 'mmol/L', '0.5 - 2.0'],
      ['Gasometría venosa: pH', '7.22', '', '7.35 - 7.45 (acidosis metabólica)'],
      ['Creatina quinasa', '2.800', 'U/L', '< 200'],
      ['TSH', '1.9', 'µU/mL', '0.4 - 4.0 (tiroides normal)'],
      ['Dinitrofenol en sangre u orina', '[NO SOLICITADO - Prueba toxicológica a pedir por el clínico]', '', 'No detectable'],
    ],
    target: 'Intoxicación por 2,4-dinitrofenol (desacoplante de la fosforilación oxidativa)',
    targetWhy:
      'Hipertermia extrema con sudoración, taquicardia, respiración rápida, acidosis láctica y tinte amarillo de la piel en un joven que toma un producto adelgazante comprado por internet.',
    differentials: [
      ['Golpe de calor por ejercicio', 'Da hipertermia y CK alta, pero tras un esfuerzo con calor ambiental, y la piel suele estar seca.'],
      ['Crisis tirotóxica', 'Produce fiebre, taquicardia y sudoración, pero la TSH estaría suprimida.'],
      ['Infección grave (sepsis)', 'Da fiebre, taquicardia y lactato alto, pero suele haber un foco y no este antecedente.'],
    ],
    correct: [
      'bm_dnp_toxicologia',
      'Dinitrofenol en sangre u orina',
      'Identifica el desacoplante responsable.',
      'Confirma la causa; el tratamiento no puede esperar al resultado (enfriamiento y soporte).',
    ],
    distractors: [
      ['bm_trab_tsh', 'Anticuerpos contra el receptor de TSH', 'Diagnostican la enfermedad de Graves.', 'La TSH normal ya descarta el hipertiroidismo.'],
      ['bm_ck_total', 'Creatina quinasa', 'Marcador de daño muscular.', 'Está alta, pero también en el golpe de calor; no distingue la causa.'],
      ['bm_troponin_c', 'Troponina', 'Marcador de daño cardíaco.', 'Conviene vigilarla, pero no diagnostica la intoxicación.'],
    ],
    key:
      'El DNP es un ácido débil que se disuelve en la membrana: capta un protón en el espacio intermembrana, atraviesa la membrana y lo suelta en la matriz. Así deshace el gradiente que la ATP sintasa necesita. En los años 30 se vendió como adelgazante y se retiró por muertes. Nuestro tejido adiposo pardo hace algo parecido de forma controlada con la termogenina (UCP1). No hay antídoto: se enfría de forma agresiva y se da soporte. No sirven los antitérmicos, porque la fiebre no viene del hipotálamo.',
    category: 'Acoplamiento entre cadena respiratoria y síntesis de ATP',
    pathway: 'Cadena respiratoria -> gradiente de H+ -> [DNP devuelve H+ sin ATP sintasa] -> calor en lugar de ATP',
    alteration: 'Desacoplamiento químico de la fosforilación oxidativa',
  },
  {
    id: 'case_baynes_metanol_01',
    title: 'Sergio T. (38 años): Visión borrosa y respiración agitada al día siguiente de beber licor casero',
    system: 'metabolic',
    difficulty: 'avanzado',
    summary:
      'Sergio T., albañil de 38 años, bebió ayer en una fiesta un aguardiente casero que trajo un amigo. Hoy ve borroso, «como con niebla», le duele la cabeza y el estómago y respira muy deprisa. Otro invitado está ingresado. El licor contenía metanol, que el hígado transforma en ácido fórmico.',
    glossary: [
      ['Alcohol deshidrogenasa', 'Enzima del hígado que oxida los alcoholes. Convierte el etanol en acetaldehído y el metanol en formaldehído.'],
      ['Inhibición competitiva', 'Cuando dos sustancias compiten por el mismo sitio activo de una enzima. La que está en mayor cantidad o se une mejor gana.'],
      ['Hueco osmolal', 'Diferencia entre la osmolalidad medida y la calculada. Si es grande, hay en la sangre una sustancia que no se mide de rutina, como un alcohol.'],
    ],
    concept:
      '1. El metanol se absorbe y llega al hígado -> 2. La alcohol deshidrogenasa lo oxida a formaldehído -> 3. Este pasa a ácido fórmico -> 4. El ácido fórmico produce acidosis metabólica grave -> 5. También bloquea la cadena respiratoria del nervio óptico: visión borrosa y ceguera.',
    patient: { age: 38, gender: 'Masculino', occupation: 'Albañil' },
    complaint: 'Visión borrosa, dolor de cabeza, dolor abdominal y respiración rápida.',
    illness:
      'Sergio T. estuvo anoche en una fiesta y bebió unos 4-5 vasos de un aguardiente casero sin etiqueta. Se acostó «algo borracho» pero normal. Esta mañana, unas 14 horas después, se ha despertado con dolor de cabeza, dolor en la boca del estómago, náuseas y visión borrosa, como si mirase a través de la niebla. Su mujer le nota que respira muy rápido y hondo. Ha sabido que otro invitado está en la UCI.',
    history: ['Sin enfermedades previas'],
    meds: ['Ninguno'],
    lifestyle: 'Bebe cerveza los fines de semana. Fuma 15 cigarrillos al día.',
    vitals: ['138/84 mmHg', '104 lpm', '30 rpm (respiración profunda)', '36.7 °C', '98%'],
    exam: [
      ['Ojos', 'Pupilas algo dilatadas que reaccionan lentamente a la luz.'],
      ['Neurológico', 'Consciente, algo confuso.'],
    ],
    labs: [
      ['Gasometría venosa: pH / bicarbonato', '7.08 / 6', ' / mEq/L', '7.35-7.45 / 22-28 (acidosis metabólica grave)'],
      ['Glucemia', '104', 'mg/dL', '70 - 110 (no es una cetoacidosis diabética)'],
      ['Lactato', '2.6', 'mmol/L', '0.5 - 2.0 (no explica tanta acidosis)'],
      ['Etanol en sangre', 'No detectable', '', '0'],
      ['Metanol y fórmico en sangre con hueco osmolal', '[NO SOLICITADO - Prueba toxicológica a pedir por el clínico]', '', 'No detectable; hueco osmolal < 10 mOsm/kg'],
    ],
    target: 'Intoxicación por metanol',
    targetWhy:
      'Acidosis metabólica grave con visión borrosa 12-24 horas después de beber un licor casero, con glucemia y lactato que no la explican y otra persona afectada.',
    differentials: [
      ['Cetoacidosis alcohólica', 'Aparece tras beber mucho y dejar de comer; da acidosis, pero con cuerpos cetónicos y sin alteraciones de la vista.'],
      ['Cetoacidosis diabética', 'Produce acidosis y respiración profunda, pero con glucemia muy alta.'],
      ['Intoxicación por etilenglicol (anticongelante)', 'También da acidosis con hueco osmolal alto, pero daña el riñón y no la vista.'],
    ],
    correct: [
      'bm_metanol_sangre',
      'Metanol y ácido fórmico con hueco osmolal',
      'Detecta el alcohol tóxico y su metabolito responsable de la acidosis.',
      'Confirma el diagnóstico; ante la sospecha se empieza el tratamiento sin esperar.',
    ],
    distractors: [
      ['bm_beta_hidroxibutirato', 'β-hidroxibutirato', 'Principal cuerpo cetónico.', 'Sería útil en una cetoacidosis; no explica la visión borrosa.'],
      ['bm_lactato', 'Lactato', 'Producto de la glucólisis anaerobia.', 'Está algo alto, pero no justifica una acidosis tan intensa.'],
      ['bm_alt', 'ALT', 'Marcador de daño hepático.', 'No identifica el tóxico.'],
    ],
    key:
      'El metanol es poco tóxico en sí mismo: lo peligroso son sus productos. Por eso los síntomas graves tardan 12-24 horas y se agravan si se ha bebido poco etanol. El tratamiento aprovecha la inhibición competitiva: el fomepizol, o el propio etanol, ocupa la alcohol deshidrogenasa y frena la formación de ácido fórmico mientras el metanol se elimina (con hemodiálisis si es necesario). El ácido fólico ayuda a convertir el fórmico en CO2 y agua.',
    category: 'Cinética enzimática e inhibición competitiva',
    pathway: 'Metanol -> [alcohol deshidrogenasa; fomepizol o etanol la bloquean] -> formaldehído -> ácido fórmico -> acidosis y daño del nervio óptico',
    alteration: 'Metabolización de un alcohol tóxico a un ácido que inhibe la citocromo oxidasa',
  },
];
