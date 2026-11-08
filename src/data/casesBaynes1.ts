import { CaseSpec } from './caseBuilder';

// Casos basados en los pacientes del Baynes · Bloque 6 (sangre y hemoglobina)

export const BAYNES_CASES_1: CaseSpec[] = [
  {
    id: 'case_baynes_g6pd_01',
    title: 'Hugo A. (24 años): Orina oscura y ojos amarillos dos días después de un plato de habas',
    system: 'hematologic',
    difficulty: 'intermedio',
    summary:
      'Hugo A., estudiante de 24 años, comió un plato de habas frescas en casa de sus abuelos. Dos días después nota la orina color coca-cola, los ojos amarillos y mucho cansancio. Sus glóbulos rojos se están rompiendo porque les falta una enzima que los protege de la oxidación.',
    glossary: [
      ['Hemólisis', 'Rotura de los glóbulos rojos dentro de los vasos o en el bazo. Libera hemoglobina y LDH a la sangre.'],
      ['NADPH', 'Coenzima reducida que fabrica la vía de las pentosas fosfato. El hematíe la necesita para mantener el glutatión preparado frente a la oxidación.'],
      ['Reticulocitos', 'Glóbulos rojos recién salidos de la médula. Suben cuando la médula intenta reponer los que se destruyen.'],
    ],
    concept:
      '1. Las habas contienen sustancias oxidantes -> 2. El hematíe necesita NADPH para defenderse, y lo fabrica la G6PDH -> 3. Sin G6PDH no hay NADPH ni glutatión reducido -> 4. La hemoglobina se oxida, precipita y la membrana se daña -> 5. Los hematíes se rompen: anemia, ictericia y orina oscura.',
    patient: { age: 24, gender: 'Masculino', occupation: 'Estudiante de Ingeniería' },
    complaint: 'Orina muy oscura, color amarillo en los ojos y cansancio desde hace un día.',
    illness:
      'Hugo A. estaba bien hasta hace 48 horas. El domingo comió un plato abundante de habas frescas. Ayer empezó con cansancio, dolor en la zona lumbar y orina muy oscura; hoy su madre le ha visto los ojos amarillos. No tiene fiebre ni ha tomado medicamentos. Recuerda que un tío materno «tuvo anemia» de joven y que nunca comía habas.',
    history: ['Sin enfermedades previas', 'Un tío materno con episodios de anemia'],
    meds: ['Ninguno'],
    lifestyle: 'No fuma ni bebe alcohol. Hace deporte habitualmente.',
    vitals: ['110/68 mmHg', '112 lpm', '20 rpm', '36.9 °C', '97%'],
    exam: [
      ['Piel y mucosas', 'Palidez e ictericia de las escleras.'],
      ['Abdomen', 'Blando. Bazo palpable en el límite del reborde costal. Hígado normal.'],
    ],
    labs: [
      ['Hemoglobina', '8.1', 'g/dL', '13.5 - 17.5'],
      ['Reticulocitos', '6.5', '%', '0.5 - 2.0 (la médula intenta compensar)'],
      ['Bilirrubina total / directa', '4.2 / 0.4', 'mg/dL', 'Total < 1.2 (predominio de la indirecta)'],
      ['LDH', '980', 'U/L', '135 - 225 (rotura de hematíes)'],
      ['Test de Coombs directo', 'Negativo', '', 'Negativo (no hay anticuerpos contra los hematíes)'],
      ['Actividad de G6PDH en hematíes', '[NO SOLICITADO - Parámetro clave a pedir por el clínico]', 'U/g Hb', '7 - 20'],
    ],
    target: 'Anemia hemolítica aguda por déficit de glucosa-6-fosfato deshidrogenasa (favismo)',
    targetWhy:
      'Varón con hemólisis aguda (anemia, reticulocitos, LDH y bilirrubina indirecta altas, orina oscura) dos días después de comer habas, con Coombs negativo y un familiar materno afectado (herencia ligada al X).',
    differentials: [
      ['Anemia hemolítica autoinmune', 'También rompe hematíes, pero el test de Coombs sería positivo y no hay un desencadenante alimentario.'],
      ['Anemia de células falciformes', 'Es otra causa hereditaria de hemólisis, pero cursa con crisis de dolor desde la infancia y hematíes en forma de hoz.'],
      ['Hepatitis aguda', 'Da ictericia y orina oscura, pero con bilirrubina directa y transaminasas altas, sin anemia ni reticulocitosis.'],
    ],
    correct: [
      'bm_g6pd_actividad',
      'Actividad de G6PDH en hematíes',
      'Mide la enzima que inicia la vía de las pentosas fosfato y produce el NADPH del hematíe.',
      'Es la prueba que identifica la causa. Conviene repetirla a los 2-3 meses si sale en el límite durante la crisis.',
    ],
    distractors: [
      ['bm_ldh', 'LDH sérica', 'Enzima que sale de los hematíes rotos.', 'Confirma que hay hemólisis, pero no dice por qué se rompen los hematíes.'],
      ['bm_electroforesis_hb', 'Electroforesis de hemoglobina', 'Separa los tipos de hemoglobina.', 'Será normal: la hemoglobina de Hugo es normal; lo que falla es la enzima que la protege.'],
      ['bm_alt', 'ALT (transaminasa)', 'Marcador de daño del hepatocito.', 'Normal o casi normal: la ictericia viene de la rotura de hematíes, no del hígado.'],
    ],
    key:
      'La G6PDH es la enzima de la vía de las pentosas fosfato que produce NADPH. El hematíe no tiene mitocondrias y esta es su única fuente de NADPH, imprescindible para regenerar el glutatión reducido. Por eso el déficit se nota sobre todo en los glóbulos rojos. Al estar el gen en el cromosoma X, lo padecen sobre todo los varones. El tratamiento es evitar habas y fármacos oxidantes (primaquina, sulfamidas, nitrofurantoína).',
    category: 'Vía de las pentosas fosfato en el hematíe',
    pathway: 'Glucosa-6-fosfato -> [G6PDH, DÉFICIT] -> 6-fosfogluconato + NADPH -> glutatión reducido -> protección frente a oxidantes',
    alteration: 'Variante del gen G6PD (cromosoma X) que produce una enzima inestable o poco activa',
  },
  {
    id: 'case_baynes_monoxido_01',
    title: 'Pilar G. (74 años): Dolor de cabeza y vómitos en invierno junto al brasero',
    system: 'hematologic',
    difficulty: 'intermedio',
    summary:
      'Pilar G., jubilada de 74 años, llega a urgencias con dolor de cabeza intenso, náuseas y mareo. Su marido, que dormía en la misma habitación, también tiene dolor de cabeza. Calientan el dormitorio con un brasero de carbón y las ventanas estaban cerradas. La saturación del pulsioxímetro es normal, pero el oxígeno no está llegando a sus tejidos.',
    glossary: [
      ['Monóxido de carbono (CO)', 'Gas sin olor ni color que se forma al quemar mal carbón, leña o gas. Se une a la hemoglobina mucho más que el oxígeno.'],
      ['Carboxihemoglobina', 'Hemoglobina con CO unido. No puede transportar oxígeno y además retiene el que lleva.'],
      ['Cooximetría', 'Medida de laboratorio que distingue los distintos tipos de hemoglobina con varias longitudes de onda de luz.'],
    ],
    concept:
      '1. El brasero quema carbón con poco oxígeno y produce CO -> 2. El CO se une al hierro del hemo unas 250 veces más fuerte que el O2 -> 3. Se forma carboxihemoglobina, que no transporta O2 -> 4. La hemoglobina restante suelta peor su oxígeno en los tejidos -> 5. Cerebro y corazón sufren falta de oxígeno: cefalea, vómitos, confusión.',
    patient: { age: 74, gender: 'Femenino', occupation: 'Jubilada' },
    complaint: 'Dolor de cabeza intenso, náuseas, vómitos y mareo al despertar.',
    illness:
      'Pilar G. y su marido viven en un pueblo y calientan el dormitorio con un brasero de carbón. Esta mañana se ha despertado con un dolor de cabeza muy fuerte, náuseas, dos vómitos y sensación de mareo al levantarse. Su marido tiene también dolor de cabeza y está algo confuso. Al salir de casa se han encontrado algo mejor. No tienen fiebre ni diarrea.',
    history: ['Hipertensión arterial', 'Angina de pecho estable'],
    meds: ['Enalapril 10 mg/día', 'Ácido acetilsalicílico 100 mg/día'],
    lifestyle: 'No fuma. Vive con su marido en una casa antigua sin calefacción central.',
    vitals: ['148/86 mmHg', '108 lpm', '24 rpm', '36.6 °C', '98% (pulsioxímetro)'],
    exam: [
      ['Estado general', 'Consciente pero lenta al responder. Piel de color normal.'],
      ['Neurológico', 'Sin focalidad. Marcha inestable.'],
    ],
    labs: [
      ['Gasometría arterial: pO2', '95', 'mmHg', '80 - 100 (el oxígeno disuelto es normal)'],
      ['Lactato', '3.8', 'mmol/L', '0.5 - 2.0 (los tejidos trabajan sin oxígeno)'],
      ['Glucemia', '118', 'mg/dL', '70 - 110'],
      ['Troponina', 'Negativa', '', 'Negativa'],
      ['Carboxihemoglobina (cooximetría)', '[NO SOLICITADO - Parámetro clave a pedir por el clínico]', '%', '< 3'],
    ],
    target: 'Intoxicación aguda por monóxido de carbono',
    targetWhy:
      'Cefalea, vómitos y confusión en dos personas que duermen juntas con un brasero y ventanas cerradas, que mejoran al salir de casa; la saturación del pulsioxímetro es engañosamente normal.',
    differentials: [
      ['Gastroenteritis o intoxicación alimentaria', 'Puede afectar a dos personas a la vez, pero con diarrea y dolor abdominal, sin cefalea intensa ni mejoría al salir de casa.'],
      ['Ictus', 'Puede dar mareo y confusión, pero suele haber un déficit focal (debilidad, habla) y no afectaría a dos personas a la vez.'],
      ['Metahemoglobinemia', 'También falla el transporte de O2, pero con piel azulada y sangre color chocolate.'],
    ],
    correct: [
      'bm_carboxihemoglobina',
      'Carboxihemoglobina por cooximetría',
      'Cuantifica directamente la hemoglobina bloqueada por el CO.',
      'Es la única prueba que confirma la intoxicación; el pulsioxímetro normal no la descarta.',
    ],
    distractors: [
      ['bm_metahemoglobina', 'Metahemoglobina', 'Hemoglobina con el hierro oxidado.', 'Útil en la cianosis inexplicada, pero Pilar no tiene la piel azulada y el desencadenante apunta al CO.'],
      ['bm_troponin_c', 'Troponina ultrasensible', 'Marcador de daño del músculo cardíaco.', 'Conviene repetirla por su angina, pero no diagnostica la causa del cuadro.'],
      ['bm_lactato', 'Lactato plasmático', 'Producto del metabolismo sin oxígeno.', 'Está alto, pero es inespecífico: sube en cualquier situación de falta de oxígeno.'],
    ],
    key:
      'El CO compite con el O2 por el mismo sitio, el hierro ferroso (Fe2+) del hemo, y gana por mucho. Además desplaza la curva de disociación de la hemoglobina a la izquierda: la hemoglobina que queda libre suelta peor el oxígeno en los tejidos. El pulsioxímetro confunde la carboxihemoglobina con la oxihemoglobina y marca saturaciones normales. El tratamiento es oxígeno al 100% (o en cámara hiperbárica en casos graves), que acorta la vida media del CO de unas 5 horas a algo más de 1 hora.',
    category: 'Transporte de oxígeno por la hemoglobina',
    pathway: 'CO inhalado -> unión al Fe2+ del hemo -> carboxihemoglobina -> menor transporte y peor cesión de O2 -> hipoxia tisular',
    alteration: 'Ocupación del sitio de unión del oxígeno por un gas con mayor afinidad',
  },
  {
    id: 'case_baynes_metahemoglobina_01',
    title: 'Nora L. (5 meses): Labios azulados después de un puré de verduras guardado',
    system: 'hematologic',
    difficulty: 'avanzado',
    summary:
      'Nora L., un bebé de 5 meses, se pone azulada en los labios y las manos una hora después de tomar un puré de acelgas y zanahoria que su padre preparó dos días antes. Respira bien, pero el oxígeno no mejora su color. Los nitratos de la verdura han oxidado el hierro de su hemoglobina.',
    glossary: [
      ['Cianosis', 'Color azulado de piel y mucosas cuando la sangre lleva poca hemoglobina con oxígeno.'],
      ['Metahemoglobina', 'Hemoglobina con el hierro en forma férrica (Fe3+). En esa forma no puede unir oxígeno.'],
      ['Azul de metileno', 'Medicamento que ayuda a reducir de nuevo el hierro férrico a ferroso.'],
    ],
    concept:
      '1. Las verduras guardadas acumulan nitritos -> 2. Los nitritos oxidan el hierro del hemo de Fe2+ a Fe3+ -> 3. Se forma metahemoglobina, que no transporta oxígeno -> 4. Los lactantes tienen poca capacidad de revertirla -> 5. Cianosis que no mejora con oxígeno y sangre color chocolate.',
    patient: { age: 0, ageLabel: '5 meses', gender: 'Femenino' },
    complaint: 'Labios, uñas y manos azulados desde hace una hora.',
    illness:
      'Nora L. es una lactante sana. Hoy ha empezado a tomar purés y su padre le ha dado uno de acelgas y zanahoria preparado hace dos días y guardado en la nevera. Una hora después la ven más pálida y con los labios y las manos azulados. Está algo irritable pero respira sin esfuerzo. En la ambulancia le han puesto oxígeno y el color no ha mejorado.',
    history: ['Embarazo y parto normales', 'Lactancia materna hasta los 4 meses'],
    meds: ['Vitamina D en gotas'],
    lifestyle: 'Vive con sus padres en una casa con agua de pozo.',
    vitals: ['85/50 mmHg', '150 lpm', '38 rpm', '36.8 °C', '86% con oxígeno'],
    exam: [
      ['Piel', 'Cianosis en labios, lengua y uñas. Sin dificultad respiratoria.'],
      ['Cardiopulmonar', 'Auscultación pulmonar normal. Corazón sin soplos.'],
    ],
    labs: [
      ['Gasometría arterial: pO2', '210', 'mmHg', '80 - 100 (alta por el oxígeno: los pulmones funcionan bien)'],
      ['Aspecto de la sangre', 'Marrón oscuro, color chocolate, que no se vuelve roja al aire', '', 'Rojo intenso'],
      ['Hemoglobina', '11.2', 'g/dL', '10 - 13'],
      ['Metahemoglobina (cooximetría)', '[NO SOLICITADO - Parámetro clave a pedir por el clínico]', '%', '< 1.5'],
    ],
    target: 'Metahemoglobinemia adquirida por nitritos de la dieta',
    targetWhy:
      'Lactante con cianosis brusca tras un puré de verduras ricas en nitratos guardado varios días, con pO2 normal, saturación baja que no mejora con oxígeno y sangre color chocolate.',
    differentials: [
      ['Cardiopatía congénita con cianosis', 'Da cianosis, pero desde el nacimiento, con soplo y pO2 baja aunque se dé oxígeno.'],
      ['Bronquiolitis o neumonía', 'Producen cianosis con dificultad para respirar, ruidos pulmonares y pO2 baja.'],
      ['Intoxicación por monóxido de carbono', 'También bloquea la hemoglobina, pero la piel no se pone azul y el pulsioxímetro marca normal.'],
    ],
    correct: [
      'bm_metahemoglobina',
      'Metahemoglobina por cooximetría',
      'Mide la fracción de hemoglobina con el hierro oxidado.',
      'Confirma el diagnóstico en minutos y marca la indicación de azul de metileno (> 20-30%).',
    ],
    distractors: [
      ['bm_carboxihemoglobina', 'Carboxihemoglobina', 'Hemoglobina unida a monóxido de carbono.', 'No hay fuente de CO y la intoxicación por CO no da cianosis.'],
      ['bm_electroforesis_hb', 'Electroforesis de hemoglobina', 'Detecta hemoglobinas anómalas hereditarias.', 'Solo tendría sentido si la cianosis fuera permanente desde el nacimiento.'],
      ['bm_troponin_c', 'Troponina', 'Marcador de daño cardíaco.', 'No orienta hacia la causa de la cianosis.'],
    ],
    key:
      'El hierro del hemo tiene que estar en forma ferrosa (Fe2+) para unir oxígeno. Los nitritos, algunos anestésicos locales (benzocaína) y otros fármacos lo oxidan a férrico (Fe3+). Los hematíes tienen una enzima, la citocromo b5 reductasa, que usa NADH para revertirlo, pero en los lactantes es poco activa. Por eso no se recomiendan purés de acelga, espinaca o remolacha antes del año ni guardarlos días. El azul de metileno, con NADPH, acelera la reducción del hierro.',
    category: 'Estado de oxidación del hierro del hemo',
    pathway: 'Nitritos -> oxidación Fe2+ -> Fe3+ en el hemo -> metahemoglobina (no une O2) -> [citocromo b5 reductasa + NADH] -> hemoglobina normal',
    alteration: 'Oxidación del hierro del hemo por un tóxico, con capacidad reductora baja propia del lactante',
  },
  {
    id: 'case_baynes_hemofilia_01',
    title: 'Pablo E. (14 meses): Moratones grandes al empezar a gatear y una rodilla hinchada',
    system: 'hematologic',
    difficulty: 'intermedio',
    summary:
      'Pablo E., de 14 meses, ha empezado a gatear y a ponerse de pie. Sus padres le ven moratones enormes en piernas y tronco, y hoy tiene la rodilla derecha hinchada y no quiere apoyar la pierna. En la sala de espera, los padres se preguntan si alguien le ha hecho daño. A su sangre le falta un factor de la coagulación.',
    glossary: [
      ['Hemartros', 'Sangrado dentro de una articulación. Es típico de los déficits de factores de la coagulación.'],
      ['TTPA (tiempo de tromboplastina parcial activada)', 'Prueba que mide cuánto tarda en coagular el plasma por la vía intrínseca (factores XII, XI, IX y VIII).'],
      ['Tiempo de protrombina (TP)', 'Prueba que mide la vía extrínseca (factor VII) y la común.'],
    ],
    concept:
      '1. Un pequeño golpe rompe vasos pequeños -> 2. Las plaquetas forman un tapón inicial -> 3. La cascada de coagulación debe reforzarlo con fibrina -> 4. Sin factor VIII, la vía intrínseca no activa bien el factor X y se forma poca fibrina -> 5. El tapón no aguanta: hematomas grandes y sangrado en articulaciones.',
    patient: { age: 1, ageLabel: '14 meses', gender: 'Masculino' },
    complaint: 'Rodilla derecha hinchada y dolorosa, y moratones grandes desde que gatea.',
    illness:
      'Pablo E. es un niño sano que empezó a gatear hace tres meses. Desde entonces le salen moratones grandes, en relieve, en rodillas, muslos y espalda con golpes mínimos. Ayer se cayó de culo desde la posición de pie y hoy tiene la rodilla derecha hinchada, caliente y no quiere apoyar. Cuando le pusieron las vacunas, el sitio del pinchazo le sangró más de lo normal. Un hermano de la madre «sangraba mucho» y murió joven.',
    history: ['Embarazo y parto normales', 'Tío materno con sangrados graves'],
    meds: ['Ninguno'],
    lifestyle: 'Va a la guardería. Calendario vacunal al día.',
    vitals: ['92/58 mmHg', '128 lpm', '28 rpm', '36.7 °C', '99%'],
    exam: [
      ['Piel', 'Varios hematomas grandes de distinta antigüedad en piernas y espalda. Sin petequias.'],
      ['Aparato locomotor', 'Rodilla derecha aumentada de tamaño, caliente y muy dolorosa al moverla.'],
    ],
    labs: [
      ['Plaquetas', '285.000', '/µL', '150.000 - 450.000 (normales)'],
      ['Tiempo de protrombina (TP)', '12', 's', '11 - 14 (normal)'],
      ['TTPA', '78', 's', '25 - 38 (muy alargado: falla la vía intrínseca)'],
      ['Hemoglobina', '10.4', 'g/dL', '10.5 - 13.5'],
      ['Actividad del factor VIII', '[NO SOLICITADO - Parámetro clave a pedir por el clínico]', '%', '50 - 150'],
    ],
    target: 'Hemofilia A (déficit de factor VIII)',
    targetWhy:
      'Varón con hematomas grandes y hemartros al empezar a gatear, plaquetas y TP normales con TTPA muy alargado, y un tío materno afectado (herencia ligada al X).',
    differentials: [
      ['Maltrato infantil', 'Siempre hay que pensarlo ante hematomas en un lactante, pero aquí la coagulación está alterada y hay antecedentes familiares.'],
      ['Trombocitopenia inmune', 'Da hematomas, pero sobre todo petequias y sangrado de mucosas, con plaquetas bajas.'],
      ['Enfermedad de von Willebrand', 'Es la alteración hereditaria de la coagulación más frecuente, pero suele dar sangrado de mucosas (nariz, encías) y no hemartros.'],
    ],
    correct: [
      'bm_factor_viii',
      'Actividad del factor VIII',
      'Cuantifica el factor de la vía intrínseca que falta en la hemofilia A.',
      'Confirma el diagnóstico y su gravedad (< 1% grave), que decide el tratamiento.',
    ],
    distractors: [
      ['bm_dimero_d', 'Dímero D', 'Producto de la degradación de la fibrina.', 'Sirve para sospechar trombos, no para estudiar un niño que sangra.'],
      ['bm_ldh', 'LDH', 'Enzima intracelular inespecífica.', 'No informa sobre la coagulación.'],
      ['bm_ck_total', 'Creatina quinasa', 'Marcador de daño muscular.', 'Puede subir algo con un hematoma muscular, pero no explica por qué sangra.'],
    ],
    key:
      'El patrón de pruebas de coagulación localiza el defecto: TP normal con TTPA alargado apunta a la vía intrínseca (factores VIII, IX, XI o XII). El factor VIII no es una enzima sino un cofactor: junto con el factor IX activado forma el complejo que activa al factor X en la superficie de las plaquetas. Como el gen está en el cromosoma X, los varones lo padecen y las mujeres lo transmiten. El tratamiento es reponer el factor VIII (o emicizumab, un anticuerpo que imita su función).',
    category: 'Cascada de la coagulación: vía intrínseca',
    pathway: 'Factor IXa + [factor VIII, DÉFICIT] -> activación del factor X -> trombina -> fibrina',
    alteration: 'Variante del gen F8 (cromosoma X) con déficit de factor VIII',
  },
  {
    id: 'case_baynes_tvp_01',
    title: 'Silvia N. (34 años): Pantorrilla hinchada y dolorosa tras un vuelo de doce horas',
    system: 'hematologic',
    difficulty: 'intermedio',
    summary:
      'Silvia N., abogada de 34 años, volvió hace tres días de un viaje a Buenos Aires. Desde ayer tiene la pantorrilla izquierda hinchada, caliente y dolorosa. Toma anticonceptivos y fuma. Se ha formado un coágulo en una vena profunda de su pierna.',
    glossary: [
      ['Trombosis venosa profunda', 'Coágulo que obstruye una vena profunda, casi siempre de la pierna.'],
      ['Dímero D', 'Fragmento que se libera cuando el cuerpo disuelve un coágulo de fibrina. Si es normal, la trombosis es muy improbable.'],
      ['Embolia pulmonar', 'Complicación en la que un trozo del coágulo viaja hasta los pulmones.'],
    ],
    concept:
      '1. Muchas horas sentada: la sangre de las piernas circula despacio -> 2. Los estrógenos del anticonceptivo y el tabaco aumentan los factores de coagulación -> 3. Se forma un coágulo de fibrina y plaquetas en una vena profunda -> 4. El sistema fibrinolítico (plasmina) empieza a disolverlo -> 5. Se liberan fragmentos de fibrina (dímero D) a la sangre.',
    patient: { age: 34, gender: 'Femenino', occupation: 'Abogada' },
    complaint: 'Dolor e hinchazón en la pantorrilla izquierda desde hace 24 horas.',
    illness:
      'Silvia N. volvió hace tres días de un viaje de trabajo en un vuelo de 12 horas en el que apenas se levantó. Ayer notó dolor en la pantorrilla izquierda al andar, que ha ido a más, y hoy la ve más hinchada que la otra. No tiene fiebre, ni le falta el aire, ni tiene dolor en el pecho. No recuerda haberse dado ningún golpe.',
    history: ['Sin enfermedades previas', 'Madre con una trombosis tras una operación'],
    meds: ['Anticonceptivo oral combinado (etinilestradiol y levonorgestrel)'],
    lifestyle: 'Fuma 10 cigarrillos al día. Trabajo sedentario.',
    vitals: ['122/76 mmHg', '88 lpm', '16 rpm', '37.1 °C', '98%'],
    exam: [
      ['Pierna izquierda', 'Pantorrilla 3 cm más gruesa que la derecha, caliente, con dolor a la palpación profunda y al flexionar el pie.'],
      ['Cardiopulmonar', 'Normal.'],
    ],
    labs: [
      ['Hemograma', 'Normal', '', 'Normal'],
      ['Tiempo de protrombina y TTPA', 'Normales', '', 'Normales'],
      ['Creatinina', '0.8', 'mg/dL', '0.6 - 1.1'],
      ['Dímero D', '[NO SOLICITADO - Parámetro clave a pedir por el clínico]', 'mg/L', '< 0.5'],
    ],
    target: 'Trombosis venosa profunda de la pierna izquierda',
    targetWhy:
      'Pierna hinchada, caliente y dolorosa tras un vuelo largo en una mujer fumadora que toma estrógenos y con una madre con antecedente de trombosis.',
    differentials: [
      ['Rotura de un quiste de Baker', 'Da dolor e hinchazón en la pantorrilla, pero suele haber artrosis de rodilla y el dolor empieza de golpe.'],
      ['Celulitis', 'Infección de la piel con enrojecimiento, calor y fiebre; los bordes de la zona roja están bien marcados.'],
      ['Desgarro muscular', 'Dolor brusco tras un esfuerzo, con hematoma; no se asocia a inmovilidad.'],
    ],
    correct: [
      'bm_dimero_d',
      'Dímero D en plasma',
      'Indica que se ha formado fibrina y se está degradando.',
      'Si es normal, descarta la trombosis; si está alto, se confirma con una ecografía de las venas.',
    ],
    distractors: [
      ['bm_factor_viii', 'Factor VIII', 'Factor de la coagulación.', 'Se estudia en los niños que sangran, no en una trombosis aguda.'],
      ['bm_ck_total', 'Creatina quinasa', 'Marcador de daño muscular.', 'Subiría en un desgarro, no en una trombosis.'],
      ['bm_troponin_c', 'Troponina', 'Marcador de daño cardíaco.', 'Solo tendría sentido si hubiera síntomas de embolia pulmonar.'],
    ],
    key:
      'Un trombo se forma cuando coinciden tres cosas (tríada de Virchow): sangre que circula despacio, sangre que coagula más de lo normal y daño en la pared del vaso. El dímero D es muy sensible pero poco específico: sube también en el embarazo, tras una cirugía o en infecciones. Por eso su utilidad es descartar: un dímero D normal con baja sospecha clínica evita la ecografía. El tratamiento es anticoagular (heparina y después anticoagulantes orales) y retirar los estrógenos.',
    category: 'Hemostasia, trombosis y fibrinólisis',
    pathway: 'Estasis + hipercoagulabilidad -> trombina -> fibrina -> trombo -> plasmina -> productos de degradación (dímero D)',
    alteration: 'Desequilibrio adquirido entre coagulación y fibrinólisis',
  },
  {
    id: 'case_baynes_mieloma_01',
    title: 'Eugenia B. (70 años): Dolor de espalda que no cede, cansancio y mucha sed',
    system: 'hematologic',
    difficulty: 'avanzado',
    summary:
      'Eugenia B., jubilada de 70 años, lleva dos meses con un dolor de espalda que no mejora con analgésicos y que la despierta por la noche. Está pálida y cansada, y tiene mucha sed. En la radiografía tiene una vértebra aplastada. Una única clona de células plasmáticas está invadiendo su médula ósea.',
    glossary: [
      ['Célula plasmática', 'Célula de la médula que fabrica anticuerpos (inmunoglobulinas).'],
      ['Componente monoclonal (banda M)', 'Exceso de un solo tipo de anticuerpo, idéntico, fabricado por una única clona de células.'],
      ['Hipercalcemia', 'Calcio alto en sangre. Produce sed, orina abundante, estreñimiento y confusión.'],
    ],
    concept:
      '1. Una célula plasmática se multiplica sin control en la médula -> 2. Todas sus copias fabrican el mismo anticuerpo (proteína monoclonal) -> 3. Desplazan a las células que fabrican hematíes: anemia -> 4. Activan a los osteoclastos, que destruyen hueso: dolor, fracturas y calcio alto -> 5. Las cadenas ligeras dañan el riñón.',
    patient: { age: 70, gender: 'Femenino', occupation: 'Costurera jubilada' },
    complaint: 'Dolor en la parte baja de la espalda desde hace dos meses, cansancio y sed.',
    illness:
      'Eugenia B. empezó con dolor lumbar sin haber hecho ningún esfuerzo. Los analgésicos no le alivian y el dolor la despierta por la noche. Desde hace un mes está muy cansada, bebe mucha agua, orina mucho y está estreñida. Ha tenido dos catarros fuertes este invierno. La radiografía que le pidió su médico muestra una vértebra lumbar aplastada.',
    history: ['Artrosis de rodillas', 'Dos infecciones respiratorias en los últimos 3 meses'],
    meds: ['Paracetamol 1 g cada 8 horas'],
    lifestyle: 'Vive sola. No fuma.',
    vitals: ['134/80 mmHg', '92 lpm', '16 rpm', '36.6 °C', '97%'],
    exam: [
      ['Estado general', 'Palidez de piel y mucosas.'],
      ['Columna', 'Dolor al presionar la columna lumbar.'],
    ],
    labs: [
      ['Hemoglobina', '9.4', 'g/dL', '12.0 - 15.5'],
      ['Calcio', '12.1', 'mg/dL', '8.5 - 10.5 (alto)'],
      ['Creatinina', '1.8', 'mg/dL', '0.6 - 1.1 (daño renal)'],
      ['Proteínas totales / albúmina', '9.2 / 3.4', 'g/dL', 'Proteínas 6.0 - 8.0 (muy altas con albúmina normal-baja)'],
      ['Electroforesis de proteínas séricas', '[NO SOLICITADO - Parámetro clave a pedir por el clínico]', '', 'Sin bandas monoclonales'],
    ],
    target: 'Mieloma múltiple',
    targetWhy:
      'Persona mayor con dolor óseo y fractura vertebral sin traumatismo, anemia, calcio alto, insuficiencia renal, infecciones repetidas y proteínas totales muy elevadas.',
    differentials: [
      ['Osteoporosis con fractura vertebral', 'Es la causa más frecuente de aplastamiento vertebral en mujeres mayores, pero no da anemia, calcio alto ni proteínas elevadas.'],
      ['Metástasis óseas de otro cáncer', 'Pueden causar dolor óseo y calcio alto, pero no aumentan las proteínas totales ni producen banda monoclonal.'],
      ['Hiperparatiroidismo primario', 'Eleva el calcio, pero no causa anemia ni aumento de proteínas.'],
    ],
    correct: [
      'bm_proteinograma',
      'Electroforesis de proteínas séricas',
      'Separa las proteínas del suero y muestra el pico estrecho del anticuerpo monoclonal.',
      'Es la prueba de cribado del mieloma; se completa con inmunofijación y estudio de la médula.',
    ],
    distractors: [
      ['bm_albu_mina', 'Albúmina sérica', 'Principal proteína del plasma.', 'No explica por qué las proteínas totales están tan altas.'],
      ['bm_fosfatasa_alcalina', 'Fosfatasa alcalina', 'Enzima que sube cuando los osteoblastos forman hueso.', 'Típicamente normal en el mieloma, porque se destruye hueso sin formarse; no lo diagnostica.'],
      ['bm_creatinina', 'Creatinina', 'Marcador de función renal.', 'Ya sabemos que está alta; no indica la causa.'],
    ],
    key:
      'Las inmunoglobulinas normales son policlonales: miles de clonas distintas fabrican anticuerpos diferentes y en la electroforesis aparecen como una zona ancha en las gammaglobulinas. En el mieloma, una sola clona fabrica millones de copias del mismo anticuerpo y aparece un pico estrecho (banda M). Las células del mieloma producen señales que activan los osteoclastos, de ahí las lesiones en «sacabocados», el dolor y la hipercalcemia. Paradójicamente, los anticuerpos útiles bajan y aumentan las infecciones.',
    category: 'Proteínas plasmáticas e inmunoglobulinas',
    pathway: 'Clona de células plasmáticas -> exceso de una inmunoglobulina -> banda M + activación de osteoclastos -> lisis ósea, hipercalcemia, anemia, daño renal',
    alteration: 'Proliferación maligna clonal de células plasmáticas',
  },
];
