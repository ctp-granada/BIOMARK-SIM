import { CaseSpec } from './caseBuilder';

// Casos basados en los pacientes del Baynes y en los casos de aminoácidos aportados por el profesorado
// Bloque 5 (aminoácidos, transporte y vitaminas)

export const BAYNES_CASES_3: CaseSpec[] = [
  {
    id: 'case_baynes_fenilcetonuria_01',
    title: 'Bruno V. (4 meses): No sujeta la cabeza, tiene eccema y un olor raro, como a moho',
    system: 'metabolic',
    difficulty: 'intermedio',
    summary:
      'Bruno V., de 4 meses, nació en casa y no le hicieron la prueba del talón. Su madre lo nota apático e irritable, todavía no sujeta la cabeza ni fija la mirada, y tiene un eccema que no se va. La piel y los pañales huelen a moho. Es mucho más rubio y claro de piel que sus padres. Su hígado no puede transformar la fenilalanina en tirosina.',
    glossary: [
      ['Fenilalanina', 'Aminoácido esencial de las proteínas de la dieta. Normalmente el hígado lo convierte en tirosina.'],
      ['Prueba del talón', 'Análisis de unas gotas de sangre del talón que se hace a todos los recién nacidos para detectar enfermedades metabólicas tratables.'],
      ['Melanina', 'Pigmento de piel, pelo y ojos que se fabrica a partir de la tirosina.'],
    ],
    concept:
      '1. La leche aporta fenilalanina -> 2. La fenilalanina hidroxilasa del hígado debería convertirla en tirosina -> 3. Sin la enzima, la fenilalanina se acumula y la tirosina baja -> 4. El exceso se desvía a fenilcetonas (olor a moho) y compite con otros aminoácidos para entrar al cerebro -> 5. Daño cerebral y menos melanina: retraso, piel y pelo claros.',
    patient: { age: 0, ageLabel: '4 meses', gender: 'Masculino' },
    complaint: 'Apatía, irritabilidad y retraso en sujetar la cabeza y fijar la mirada.',
    illness:
      'Bruno V. nació a término en un parto en casa sin complicaciones y no se le hizo la prueba del talón. Toma pecho sin problemas. Su madre lo nota cada vez más apático e irritable; a los 4 meses no sujeta la cabeza ni sigue la cara de sus padres. Tiene un eccema en mejillas y pliegues desde hace semanas. La madre dice que el pañal y la piel tienen un olor fuerte y raro, «como a moho o a ratón mojado».',
    history: ['Parto en casa sin prueba del talón', 'Padres y hermanos morenos de piel y pelo'],
    meds: ['Ninguno'],
    lifestyle: 'Lactancia materna exclusiva.',
    vitals: ['80/50 mmHg', '130 lpm', '32 rpm', '36.7 °C', '99%'],
    exam: [
      ['Aspecto', 'Piel muy clara, pelo rubio y ojos azules, en contraste con su familia. Eccema en mejillas.'],
      ['Neurológico', 'No sujeta la cabeza. Reflejos vivos y temblor fino. Perímetro de la cabeza pequeño.'],
    ],
    labs: [
      ['Glucemia', '84', 'mg/dL', '60 - 100'],
      ['Amonio', '42', 'µmol/L', '< 80 (normal)'],
      ['Prueba del cloruro férrico en orina', 'Color verde', '', 'Negativa (detecta fenilcetonas)'],
      ['Fenilalanina y tirosina en plasma', '[NO SOLICITADO - Parámetro clave a pedir por el clínico]', 'µmol/L', 'Fenilalanina < 120'],
    ],
    target: 'Fenilcetonuria (déficit de fenilalanina hidroxilasa)',
    targetWhy:
      'Lactante sin prueba del talón con retraso del desarrollo, cabeza pequeña, eccema, olor a moho y piel y pelo mucho más claros que su familia.',
    differentials: [
      ['Albinismo', 'Da piel y pelo muy claros, pero sin retraso del desarrollo, sin olor y con fenilalanina normal.'],
      ['Defecto del ciclo de la urea', 'Produce daño cerebral en lactantes, pero con vómitos, somnolencia y amonio alto.'],
      ['Hipotiroidismo congénito', 'También se detecta en la prueba del talón y retrasa el desarrollo, pero con estreñimiento, lengua grande e ictericia prolongada.'],
    ],
    correct: [
      'bm_fenilalanina_tirosina',
      'Fenilalanina y tirosina en plasma',
      'Fenilalanina muy alta con tirosina baja localiza el bloqueo en la fenilalanina hidroxilasa.',
      'Confirma el diagnóstico y es el parámetro con el que se controla la dieta toda la vida.',
    ],
    distractors: [
      ['bm_amonio_plasmatico', 'Amonio plasmático', 'Marcador de los defectos del ciclo de la urea.', 'Es normal; Bruno no tiene vómitos ni somnolencia aguda.'],
      ['bm_aminoacidos_ramificados', 'Leucina, isoleucina y valina', 'Diagnostican la enfermedad del jarabe de arce.', 'Esa enfermedad debuta en la primera semana con un cuadro grave y olor dulce, no a moho.'],
      ['bm_glucosa', 'Glucemia', 'Glucosa en sangre.', 'Normal; no explica el cuadro.'],
    ],
    key:
      'La fenilalanina hidroxilasa usa tetrahidrobiopterina (BH4) y oxígeno para añadir un grupo -OH a la fenilalanina y convertirla en tirosina. En la fenilcetonuria la tirosina pasa a ser un aminoácido que hay que tomar en la dieta. La fenilalanina en exceso bloquea la tirosinasa (menos melanina) y compite por el transportador de aminoácidos grandes de la barrera hematoencefálica. Con dieta pobre en fenilalanina desde las primeras semanas, el desarrollo es normal: por eso existe la prueba del talón.',
    category: 'Degradación de la fenilalanina y la tirosina',
    pathway: 'Fenilalanina -> [fenilalanina hidroxilasa + BH4, DÉFICIT] -> tirosina -> melanina y neurotransmisores; desvío: fenilalanina -> fenilpiruvato -> fenilacetato',
    alteration: 'Variantes del gen PAH con déficit de fenilalanina hidroxilasa',
  },
  {
    id: 'case_baynes_jarabe_arce_01',
    title: 'Lola T. (9 días): Deja de mamar, está adormilada y el pañal huele a azúcar quemado',
    system: 'metabolic',
    difficulty: 'avanzado',
    summary:
      'Lola T., de 9 días, estaba bien los primeros días, pero ahora apenas mama, está adormilada y tiene un llanto agudo. Hace movimientos raros con brazos y piernas, como si pedaleara. Sus padres notan que el pañal y hasta la cera de los oídos huelen dulce, a caramelo o azúcar quemado. No puede degradar los aminoácidos ramificados.',
    glossary: [
      ['Aminoácidos ramificados', 'Leucina, isoleucina y valina. Se degradan sobre todo en el músculo y el hígado.'],
      ['Cetoácido', 'Molécula que resulta de quitar el grupo amino a un aminoácido (transaminación).'],
      ['Encefalopatía', 'Alteración del funcionamiento del cerebro: somnolencia, irritabilidad, convulsiones o coma.'],
    ],
    concept:
      '1. La leche aporta leucina, isoleucina y valina -> 2. Pierden su grupo amino y se convierten en cetoácidos ramificados -> 3. Un complejo enzimático mitocondrial debería descarboxilarlos -> 4. Si falla, se acumulan aminoácidos y cetoácidos en sangre y orina (olor dulce) -> 5. La leucina es tóxica para el cerebro: somnolencia, movimientos anormales y edema cerebral.',
    patient: { age: 0, ageLabel: '9 días', gender: 'Femenino' },
    complaint: 'Rechazo de las tomas, somnolencia y llanto agudo desde hace dos días.',
    illness:
      'Lola T. nació a término sin problemas y mamaba bien. Desde hace dos días apenas succiona, duerme casi todo el tiempo y cuando llora lo hace con un llanto agudo y monótono. Hoy sus padres han visto que a ratos se queda muy floja y a ratos se pone rígida con la espalda en arco, y que mueve brazos y piernas como pedaleando. El pañal y el cerumen huelen dulce, a caramelo quemado. La prueba del talón está pendiente de resultado.',
    history: ['Embarazo y parto normales', 'Padres primos hermanos'],
    meds: ['Ninguno'],
    lifestyle: 'Lactancia materna.',
    vitals: ['70/42 mmHg', '150 lpm', '40 rpm', '36.4 °C', '98%'],
    exam: [
      ['Neurológico', 'Muy adormilada. Alterna flacidez con rigidez en arco. Succión débil. Movimientos de pedaleo.'],
      ['Olor', 'Olor dulce intenso en piel y orina.'],
    ],
    labs: [
      ['Glucemia', '52', 'mg/dL', '50 - 90'],
      ['Amonio', '68', 'µmol/L', '< 100 (normal o poco alto)'],
      ['Gasometría: pH', '7.29', '', '7.35 - 7.45 (acidosis metabólica)'],
      ['Cuerpos cetónicos en orina', '+++', '', 'Negativos'],
      ['Aminoácidos ramificados en plasma (leucina, isoleucina, valina, aloisoleucina)', '[NO SOLICITADO - Parámetro clave a pedir por el clínico]', 'µmol/L', 'Leucina 50 - 200; aloisoleucina no detectable'],
    ],
    target: 'Enfermedad de la orina con olor a jarabe de arce',
    targetWhy:
      'Recién nacida sana los primeros días que, tras iniciar la lactancia, desarrolla encefalopatía con movimientos de pedaleo, cetoacidosis, amonio casi normal y olor dulce en orina y cerumen; padres consanguíneos.',
    differentials: [
      ['Sepsis neonatal', 'Es lo primero que hay que descartar ante un recién nacido que deja de comer, pero no explica el olor dulce.'],
      ['Defecto del ciclo de la urea', 'Da encefalopatía neonatal tras empezar a comer, pero con amonio muy alto y sin cetosis.'],
      ['Fenilcetonuria', 'También es un error de los aminoácidos, pero no da un cuadro agudo en la primera semana y el olor es a moho.'],
    ],
    correct: [
      'bm_aminoacidos_ramificados',
      'Leucina, isoleucina, valina y aloisoleucina en plasma',
      'Los tres aminoácidos ramificados muy altos y la presencia de aloisoleucina señalan el bloqueo.',
      'Confirma el diagnóstico en horas y guía el tratamiento urgente.',
    ],
    distractors: [
      ['bm_amonio_plasmatico', 'Amonio', 'Marcador de los defectos del ciclo de la urea.', 'Está casi normal; no explica una encefalopatía tan grave.'],
      ['bm_fenilalanina_tirosina', 'Fenilalanina y tirosina', 'Diagnostican la fenilcetonuria.', 'Serán normales.'],
      ['bm_lactato', 'Lactato', 'Producto de la glucólisis anaerobia.', 'Puede estar algo alto, pero no identifica la enfermedad.'],
    ],
    key:
      'El complejo deshidrogenasa de cetoácidos ramificados se parece mucho al complejo piruvato deshidrogenasa: usa los mismos cofactores (tiamina pirofosfato, lipoato, CoA, FAD y NAD+). Por eso algunos pacientes mejoran con dosis altas de tiamina. El olor procede de un derivado de la isoleucina. La crisis es una urgencia: se retiran las proteínas, se aporta mucha energía para frenar el catabolismo y, si hace falta, se elimina la leucina con diálisis. Después, dieta con poca leucina, isoleucina y valina toda la vida.',
    category: 'Degradación de los aminoácidos ramificados',
    pathway: 'Leucina, isoleucina, valina -> [transaminación] -> cetoácidos ramificados -> [deshidrogenasa de cetoácidos ramificados, DÉFICIT] -> acil-CoA',
    alteration: 'Variantes en los genes del complejo BCKDH (herencia autosómica recesiva)',
  },
  {
    id: 'case_baynes_alcaptonuria_01',
    title: 'Ramón Q. (41 años): Dolor de espalda y caderas, y orejas de color azulado',
    system: 'metabolic',
    difficulty: 'intermedio',
    summary:
      'Ramón Q., camionero de 41 años, lleva años con dolor y rigidez en la espalda, las caderas y las rodillas, como si tuviera la artrosis de alguien de 70. Su mujer le ha notado manchas oscuras en el blanco de los ojos y las orejas azuladas. Su madre recuerda que de bebé los pañales se ponían negros si se dejaban un rato. Le falta una enzima de la degradación de la tirosina.',
    glossary: [
      ['Ácido homogentísico', 'Intermediario de la degradación de la tirosina. Al oxidarse forma un pigmento oscuro.'],
      ['Ocronosis', 'Depósito de ese pigmento oscuro en cartílagos, tendones, piel y escleras.'],
      ['Artrosis', 'Desgaste del cartílago de las articulaciones, con dolor y rigidez.'],
    ],
    concept:
      '1. La tirosina se degrada por varios pasos hasta fumarato y acetoacetato -> 2. Uno de ellos lo realiza la homogentisato dioxigenasa -> 3. Si falta, el ácido homogentísico se acumula y se elimina por la orina -> 4. Al contacto con el aire se oxida y la orina se vuelve negra -> 5. Con los años el pigmento se fija al colágeno de los cartílagos y los vuelve frágiles: artrosis precoz.',
    patient: { age: 41, gender: 'Masculino', occupation: 'Camionero' },
    complaint: 'Dolor y rigidez en la columna lumbar, caderas y rodillas desde hace 3 años.',
    illness:
      'Ramón Q. tiene dolor lumbar y de caderas desde hace tres años, cada vez peor; ahora le cuesta subir escaleras y atarse los zapatos. Los antiinflamatorios le alivian poco. Su mujer le ha visto manchas grisáceas en el blanco de los ojos y dice que sus orejas son más oscuras y duras de lo normal. Su madre recuerda que de bebé, si dejaba un pañal mojado en el cubo unas horas, se ponía negro. Él ha notado que la orina se oscurece si la deja en el bote.',
    history: ['Lumbalgia crónica', 'Hermana con «artrosis precoz»'],
    meds: ['Ibuprofeno a demanda'],
    lifestyle: 'Conduce muchas horas al día. No fuma.',
    vitals: ['130/80 mmHg', '72 lpm', '14 rpm', '36.5 °C', '98%'],
    exam: [
      ['Ojos y orejas', 'Manchas pardo-grisáceas en las escleras. Cartílago de las orejas azulado y rígido.'],
      ['Aparato locomotor', 'Movilidad de la columna lumbar muy reducida. Crujidos dolorosos en ambas rodillas.'],
    ],
    labs: [
      ['Velocidad de sedimentación y PCR', 'Normales', '', 'Normales (no hay inflamación)'],
      ['Ácido úrico', '5.4', 'mg/dL', '3.5 - 7.2 (no es gota)'],
      ['Orina tras añadir un álcali', 'Se vuelve negra en minutos', '', 'Sin cambio de color'],
      ['Radiografía de columna', 'Discos intervertebrales estrechados y calcificados', '', 'Normal'],
      ['Ácido homogentísico en orina', '[NO SOLICITADO - Parámetro clave a pedir por el clínico]', 'mg/24 h', 'No detectable'],
    ],
    target: 'Alcaptonuria (déficit de homogentisato 1,2-dioxigenasa)',
    targetWhy:
      'Artrosis precoz de columna y grandes articulaciones, pigmentación oscura de escleras y orejas, y orina que se vuelve negra al aire desde la infancia.',
    differentials: [
      ['Espondilitis anquilosante', 'Da dolor lumbar y rigidez en hombres jóvenes, pero es inflamatoria (PCR y VSG altas) y no pigmenta orejas ni orina.'],
      ['Artrosis primaria', 'Es muy frecuente, pero no a esta edad ni con pigmentación de los cartílagos.'],
      ['Porfiria', 'Puede dar orina oscura, pero con dolor abdominal o lesiones en la piel expuesta al sol, sin artrosis.'],
    ],
    correct: [
      'bm_acido_homogentisico',
      'Ácido homogentísico en orina de 24 horas',
      'Demuestra la acumulación del metabolito que no puede degradarse.',
      'Confirma el diagnóstico (gramos al día frente a cantidades indetectables en sanos).',
    ],
    distractors: [
      ['bm_acido_urico', 'Ácido úrico', 'Producto final de las purinas.', 'Normal; descarta gota, pero no explica la pigmentación.'],
      ['bm_bilirrubina_total', 'Bilirrubina', 'Pigmento que oscurece la orina en las ictericias.', 'Normal; Ramón no tiene ictericia.'],
      ['bm_fenilalanina_tirosina', 'Fenilalanina y tirosina', 'Se alteran en la fenilcetonuria.', 'Normales: el bloqueo está más adelante en la ruta.'],
    ],
    key:
      'La alcaptonuria fue la primera enfermedad que Garrod llamó «error innato del metabolismo» (1902): una enzima que falta y un metabolito que se acumula. El ácido homogentísico se oxida a benzoquinonas que polimerizan en un pigmento parecido a la melanina y se unen al colágeno. La nitisinona bloquea un paso anterior de la ruta (4-hidroxifenilpiruvato dioxigenasa) y reduce mucho la producción de ácido homogentísico.',
    category: 'Degradación de la fenilalanina y la tirosina',
    pathway: 'Tirosina -> 4-hidroxifenilpiruvato -> ácido homogentísico -> [homogentisato 1,2-dioxigenasa, DÉFICIT] -> maleilacetoacetato -> fumarato + acetoacetato',
    alteration: 'Variantes del gen HGD (herencia autosómica recesiva)',
  },
  {
    id: 'case_baynes_homocistinuria_01',
    title: 'Jimena C. (14 años): Muy alta, delgada y de repente ve borroso por un ojo',
    system: 'metabolic',
    difficulty: 'avanzado',
    summary:
      'Jimena C., de 14 años, es la más alta de su clase, muy delgada y con dedos largos. Desde pequeña lleva gafas de miopía fuerte y tiene escoliosis. Hoy ha perdido visión por el ojo izquierdo. Su hermano murió con 22 años por una trombosis. El cristalino se le ha desplazado y la causa está en el metabolismo de la metionina.',
    glossary: [
      ['Homocisteína', 'Aminoácido intermedio entre la metionina y la cisteína. No forma parte de las proteínas.'],
      ['Luxación del cristalino', 'Desplazamiento de la lente del ojo porque se rompen las fibras que la sujetan.'],
      ['Vitamina B6 (piridoxal fosfato)', 'Coenzima de muchas enzimas del metabolismo de los aminoácidos.'],
    ],
    concept:
      '1. La metionina de la dieta se convierte en homocisteína -> 2. La cistationina β-sintasa (con vitamina B6) la une a serina para formar cistationina y luego cisteína -> 3. Si falta, la homocisteína se acumula en sangre y orina -> 4. Altera las proteínas del tejido conectivo, como las fibras que sujetan el cristalino -> 5. Daña el endotelio y activa la coagulación: trombosis a edades jóvenes.',
    patient: { age: 14, gender: 'Femenino', occupation: 'Estudiante' },
    complaint: 'Pérdida brusca de visión en el ojo izquierdo.',
    illness:
      'Jimena C. ha notado esta mañana que ve muy borroso por el ojo izquierdo. Usa gafas por miopía alta desde los 6 años y la siguen en traumatología por escoliosis. Le cuesta seguir el ritmo del colegio. Su hermano mayor falleció a los 22 años por una trombosis en la pierna que se complicó con una embolia pulmonar. Sus padres están sanos.',
    history: ['Miopía alta desde los 6 años', 'Escoliosis', 'Dificultades de aprendizaje', 'Hermano fallecido por trombosis a los 22 años'],
    meds: ['Ninguno'],
    lifestyle: 'Hace natación.',
    vitals: ['112/70 mmHg', '78 lpm', '14 rpm', '36.6 °C', '99%'],
    exam: [
      ['Aspecto', 'Talla en el percentil 97, brazos y piernas largos, dedos largos y finos, tórax en quilla.'],
      ['Ojos', 'Cristalino izquierdo desplazado hacia abajo y hacia dentro.'],
    ],
    labs: [
      ['Hemograma', 'Normal', '', 'Normal'],
      ['Vitamina B12 y ácido fólico', 'Normales', '', 'Normales'],
      ['Prueba del cianuro-nitroprusiato en orina', 'Positiva (color magenta)', '', 'Negativa'],
      ['Homocisteína total en plasma', '[NO SOLICITADO - Parámetro clave a pedir por el clínico]', 'µmol/L', '5 - 15'],
    ],
    target: 'Homocistinuria clásica (déficit de cistationina β-sintasa)',
    targetWhy:
      'Adolescente alta y delgada con luxación del cristalino hacia abajo, miopía, escoliosis, dificultades de aprendizaje y un hermano fallecido por trombosis a edad joven, con B12 y fólico normales.',
    differentials: [
      ['Síndrome de Marfan', 'Tiene un aspecto casi igual y también luxa el cristalino, pero hacia arriba, sin dificultades de aprendizaje ni trombosis, y con homocisteína normal.'],
      ['Déficit de vitamina B12 o ácido fólico', 'También eleva la homocisteína, pero con anemia de hematíes grandes y sin cambios en el esqueleto.'],
      ['Traumatismo ocular', 'Puede luxar el cristalino, pero no hay golpe previo y no explica el resto.'],
    ],
    correct: [
      'bm_homocisteina',
      'Homocisteína total en plasma',
      'Mide directamente el aminoácido que se acumula por el bloqueo.',
      'Valores > 100 µmol/L con B12 y fólico normales confirman la homocistinuria; se completa con la prueba de respuesta a B6.',
    ],
    distractors: [
      ['bm_vitamina_b12', 'Vitamina B12', 'Cofactor de la remetilación de la homocisteína.', 'Normal; se mide para descartar otra causa, pero no confirma el diagnóstico.'],
      ['bm_dimero_d', 'Dímero D', 'Producto de la degradación de la fibrina.', 'Solo sería útil si tuviera síntomas de trombosis ahora.'],
      ['bm_cistina_orina', 'Cistina en orina', 'Diagnostica la cistinuria.', 'La cistinuria da cálculos renales, no este cuadro.'],
    ],
    key:
      'La homocisteína tiene dos salidas: volver a metionina (remetilación, con B12 y ácido fólico) o seguir hacia cisteína (transulfuración, con B6). En la homocistinuria clásica falla la segunda. Un truco clínico: en la homocistinuria el cristalino se desplaza hacia abajo y en el Marfan hacia arriba. Algunos pacientes responden a dosis altas de vitamina B6 porque su enzima mutante une peor la coenzima. Si no, dieta pobre en metionina y betaína.',
    category: 'Metabolismo de la metionina y transulfuración',
    pathway: 'Metionina -> homocisteína -> [cistationina β-sintasa + B6, DÉFICIT] -> cistationina -> cisteína',
    alteration: 'Variantes del gen CBS (herencia autosómica recesiva)',
  },
  {
    id: 'case_baynes_cistinosis_01',
    title: 'Adam B. (18 meses): Bebe y orina muchísimo y no gana peso',
    system: 'renal',
    difficulty: 'avanzado',
    summary:
      'Adam B., de 18 meses, bebe agua sin parar, moja muchísimos pañales y lleva meses sin ganar peso ni crecer. Ha ingresado dos veces por deshidratación con vómitos. Tiene las muñecas anchas y las piernas arqueadas. La cistina se acumula dentro de sus células porque no puede salir de los lisosomas.',
    glossary: [
      ['Lisosoma', 'Orgánulo que degrada proteínas y otras moléculas. Los productos tienen que salir al citosol por transportadores.'],
      ['Síndrome de Fanconi', 'Fallo del túbulo proximal del riñón, que pierde por la orina glucosa, aminoácidos, fosfato y bicarbonato.'],
      ['Raquitismo', 'Huesos blandos y deformados por falta de calcio o fosfato.'],
    ],
    concept:
      '1. Los lisosomas degradan proteínas y liberan cistina -> 2. La cistina sale al citosol gracias a la cistinosina -> 3. Si falta, la cistina se acumula y forma cristales dentro de los lisosomas -> 4. Las células del túbulo proximal se dañan primero -> 5. Pérdida de agua, glucosa, fosfato y aminoácidos por la orina: sed, deshidratación, raquitismo y falta de crecimiento.',
    patient: { age: 1, ageLabel: '18 meses', gender: 'Masculino' },
    complaint: 'Sed constante, orina abundante y estancamiento del peso.',
    illness:
      'Adam B. se desarrolló bien hasta los 6 meses. Desde entonces bebe mucha agua, se despierta por la noche pidiendo agua y empapa los pañales. Come poco y vomita con facilidad. Ha ingresado dos veces por deshidratación. Su peso no ha cambiado en 5 meses. Todavía no camina y tiene las piernas arqueadas. La luz le molesta mucho.',
    history: ['Dos ingresos por deshidratación', 'Padres sanos, no consanguíneos'],
    meds: ['Ninguno'],
    lifestyle: 'Va a la guardería.',
    vitals: ['86/52 mmHg', '128 lpm', '30 rpm', '36.5 °C', '99%'],
    exam: [
      ['Crecimiento', 'Peso y talla por debajo del percentil 3.'],
      ['Esqueleto', 'Muñecas ensanchadas y piernas arqueadas (raquitismo).'],
      ['Ojos', 'Molestia intensa a la luz (fotofobia).'],
    ],
    labs: [
      ['Glucemia', '86', 'mg/dL', '60 - 100 (normal)'],
      ['Glucosa en orina', '+++', '', 'Negativa (se pierde con glucemia normal)'],
      ['Fosfato en sangre', '2.1', 'mg/dL', '4.0 - 6.5 (bajo)'],
      ['Bicarbonato', '15', 'mEq/L', '22 - 28 (acidosis)'],
      ['Cistina dentro de los leucocitos', '[NO SOLICITADO - Parámetro clave a pedir por el clínico]', 'nmol hemicistina/mg proteína', '< 0.2'],
    ],
    target: 'Cistinosis nefropática infantil',
    targetWhy:
      'Lactante con poliuria, sed, deshidrataciones, raquitismo y fotofobia, que pierde glucosa, fosfato y bicarbonato por la orina con glucemia normal (síndrome de Fanconi).',
    differentials: [
      ['Diabetes mellitus tipo 1', 'Da sed, orina abundante y glucosa en la orina, pero con glucemia alta.'],
      ['Cistinuria', 'Se pierde cistina por la orina y forma cálculos, pero el túbulo funciona bien en todo lo demás y no hay cistina dentro de las células.'],
      ['Diabetes insípida', 'Da sed y orina abundante, pero sin glucosa ni fosfato en la orina.'],
    ],
    correct: [
      'bm_cistina_leucocitos',
      'Cistina dentro de los leucocitos',
      'Mide la cistina atrapada en los lisosomas de las células de la sangre.',
      'Confirma el diagnóstico y se usa para ajustar el tratamiento con cisteamina.',
    ],
    distractors: [
      ['bm_cistina_orina', 'Cistina en orina', 'Diagnostica la cistinuria.', 'En la cistinosis la cistina está dentro de las células; en la orina sale con todos los demás aminoácidos.'],
      ['bm_hba1c', 'Hemoglobina glicada', 'Refleja la glucemia media.', 'Normal: la glucosa se pierde por el riñón, no porque esté alta en sangre.'],
      ['bm_creatinina', 'Creatinina', 'Marcador de función renal.', 'Útil para seguir la enfermedad, pero no identifica la causa.'],
    ],
    key:
      'Cistinosis y cistinuria se confunden por el nombre pero son muy distintas. En la cistinuria falla un transportador de la membrana del túbulo renal y del intestino: la cistina se pierde por la orina y forma cálculos. En la cistinosis falla un transportador de la membrana del lisosoma: la cistina queda atrapada dentro de todas las células. La cisteamina entra en el lisosoma, reacciona con la cistina y forma un compuesto que sí puede salir por otro transportador.',
    category: 'Transporte a través de membranas de orgánulos',
    pathway: 'Proteínas -> lisosoma -> cistina -> [cistinosina, DÉFICIT] -> cistina en el citosol',
    alteration: 'Variantes del gen CTNS (herencia autosómica recesiva)',
  },
  {
    id: 'case_baynes_hartnup_01',
    title: 'Iker S. (11 años): Manchas rojas que se descaman en la cara y los brazos cada verano',
    system: 'metabolic',
    difficulty: 'avanzado',
    summary:
      'Iker S., de 11 años, vuelve cada verano de la playa con la cara, el cuello y los brazos rojos, ásperos y descamados, mucho más que sus hermanos. Este año también tiene dolores de cabeza y camina algo inestable. Come de todo. Su intestino y su riñón no absorben bien algunos aminoácidos, entre ellos el triptófano.',
    glossary: [
      ['Triptófano', 'Aminoácido esencial. Además de formar proteínas, el cuerpo lo usa para fabricar niacina (vitamina B3).'],
      ['Niacina (vitamina B3)', 'Vitamina que el cuerpo usa para fabricar NAD+ y NADP+.'],
      ['Aminoaciduria', 'Pérdida de aminoácidos por la orina.'],
    ],
    concept:
      '1. Los aminoácidos neutros (como el triptófano) se absorben en el intestino y se recuperan en el riñón con el mismo transportador -> 2. Si falta, se pierden por las heces y la orina -> 3. Llega poco triptófano a las células -> 4. Se fabrica menos niacina y menos NAD+ -> 5. Lesiones de piel en zonas de sol, como en la pelagra, y síntomas neurológicos.',
    patient: { age: 11, gender: 'Masculino', occupation: 'Estudiante' },
    complaint: 'Lesiones rojas y descamadas en zonas expuestas al sol, dolor de cabeza e inestabilidad.',
    illness:
      'Desde los 5 años, cada verano Iker S. desarrolla lesiones rojas, ásperas y descamadas en la cara, el cuello, el dorso de las manos y los antebrazos, que mejoran en invierno. Este verano además tiene dolores de cabeza frecuentes y en las últimas semanas camina algo inestable, como mareado. Come carne, pescado, legumbres y verdura sin problemas. Una prima tuvo «algo parecido en la piel».',
    history: ['Lesiones de piel cada verano desde los 5 años', 'Padres primos segundos'],
    meds: ['Crema hidratante'],
    lifestyle: 'Dieta variada y suficiente. Juega al fútbol al aire libre.',
    vitals: ['104/64 mmHg', '84 lpm', '18 rpm', '36.6 °C', '99%'],
    exam: [
      ['Piel', 'Placas rojas, ásperas e hiperpigmentadas, con descamación, en cara, cuello, manos y antebrazos. Respeta las zonas cubiertas.'],
      ['Neurológico', 'Marcha algo inestable. Resto normal.'],
    ],
    labs: [
      ['Hemograma y bioquímica básica', 'Normales', '', 'Normales'],
      ['Albúmina', '4.3', 'g/dL', '3.5 - 5.0 (bien nutrido)'],
      ['Glucosa en orina', 'Negativa', '', 'Negativa (el túbulo funciona bien en general)'],
      ['Cromatografía de aminoácidos en orina', '[NO SOLICITADO - Parámetro clave a pedir por el clínico]', '', 'Patrón normal'],
    ],
    target: 'Enfermedad de Hartnup (defecto del transporte de aminoácidos neutros)',
    targetWhy:
      'Niño bien alimentado con lesiones de tipo pelagra en zonas expuestas al sol desde pequeño, síntomas neurológicos intermitentes y padres consanguíneos.',
    differentials: [
      ['Pelagra por falta de niacina en la dieta', 'Las lesiones son iguales, pero aparecen en personas malnutridas o alcohólicas; Iker come bien.'],
      ['Lupus o fotosensibilidad por fármacos', 'Dan lesiones en zonas de sol, pero sin la historia familiar ni la ataxia, y no toma fármacos.'],
      ['Cistinuria', 'También es un defecto del transporte de aminoácidos, pero de otro grupo (cistina y básicos) y produce cálculos.'],
    ],
    correct: [
      'bm_aminoacidos_orina',
      'Cromatografía de aminoácidos en orina',
      'Muestra la pérdida de aminoácidos neutros (triptófano, alanina, serina, fenilalanina...) con los demás normales.',
      'El patrón concreto identifica el transportador defectuoso.',
    ],
    distractors: [
      ['bm_niacina_metabolitos', 'Metabolitos de la niacina en orina', 'Reflejan las reservas de niacina.', 'Pueden estar bajos, pero no distinguen Hartnup de una pelagra por falta de aporte.'],
      ['bm_cistina_orina', 'Cistina en orina', 'Diagnostica la cistinuria.', 'Normal; otro transportador.'],
      ['bm_albu_mina', 'Albúmina', 'Refleja el estado nutricional proteico.', 'Normal; no aclara el diagnóstico.'],
    ],
    key:
      'El triptófano es el precursor de la niacina: unos 60 mg de triptófano dan 1 mg de niacina. En la enfermedad de Hartnup falla el transportador B0AT1 de aminoácidos neutros, presente en el intestino y en el túbulo renal. Muchos pacientes no tienen síntomas porque absorben péptidos pequeños por otro transportador (PEPT1). El tratamiento es nicotinamida oral, protección solar y una dieta rica en proteínas.',
    category: 'Transporte de aminoácidos en intestino y riñón',
    pathway: 'Aminoácidos neutros en la luz -> [transportador B0AT1, DÉFICIT] -> enterocito / célula tubular; triptófano -> niacina -> NAD+',
    alteration: 'Variantes del gen SLC6A19 (herencia autosómica recesiva)',
  },
  {
    id: 'case_baynes_pelagra_01',
    title: 'Rosa I. (52 años): Piel quemada en el cuello y las manos, diarrea y despistes',
    system: 'metabolic',
    difficulty: 'intermedio',
    summary:
      'Rosa I., de 52 años, bebe mucho alcohol desde que perdió su trabajo y apenas come. Su hermana la trae porque tiene la piel del cuello y las manos oscura y descamada «como quemada», diarrea desde hace semanas y está despistada y olvidadiza. Le falta niacina, la vitamina con la que se fabrica el NAD+.',
    glossary: [
      ['Pelagra', 'Enfermedad por falta de niacina. Se recuerda por las «3 D»: dermatitis, diarrea y demencia.'],
      ['NAD+', 'Coenzima que acepta electrones en cientos de reacciones de oxidación, como en la glucólisis o el ciclo de Krebs.'],
      ['Collar de Casal', 'Lesión de pelagra alrededor del cuello, por la exposición al sol.'],
    ],
    concept:
      '1. La niacina se obtiene de la dieta o del triptófano -> 2. El alcohol y la mala alimentación reducen su aporte y su absorción -> 3. Se fabrica poco NAD+ y NADP+ -> 4. Fallan las células que se renuevan rápido (piel, intestino) y las neuronas -> 5. Dermatitis en zonas de sol, diarrea y alteraciones mentales.',
    patient: { age: 52, gender: 'Femenino', occupation: 'En paro' },
    complaint: 'Lesiones oscuras en cuello y manos, diarrea y pérdida de memoria.',
    illness:
      'Rosa I. bebe casi una botella de vino al día desde hace dos años. Come muy poco: café, pan y alguna galleta. Desde hace dos meses tiene la piel del cuello, el escote y el dorso de las manos roja, oscura y descamada, y le escuece al sol. Tiene 4-5 deposiciones líquidas al día y le duele la lengua. Su hermana la nota despistada: se le olvidan las cosas y repite preguntas.',
    history: ['Consumo excesivo de alcohol', 'Pérdida de 8 kg en 6 meses'],
    meds: ['Ninguno'],
    lifestyle: 'Vive sola. Bebe alcohol a diario. Dieta muy pobre.',
    vitals: ['108/68 mmHg', '96 lpm', '16 rpm', '36.4 °C', '98%'],
    exam: [
      ['Piel', 'Placas oscuras, ásperas y descamadas en cuello (en forma de collar), escote y dorso de las manos, con borde bien marcado.'],
      ['Boca', 'Lengua roja, lisa y dolorosa.'],
      ['Mental', 'Orientada, pero con fallos de memoria reciente.'],
    ],
    labs: [
      ['Hemoglobina', '10.8', 'g/dL', '12.0 - 15.5'],
      ['Albúmina', '3.1', 'g/dL', '3.5 - 5.0 (desnutrición)'],
      ['GGT', '186', 'U/L', '< 40 (consumo de alcohol)'],
      ['Metabolitos de la niacina en orina', '[NO SOLICITADO - Parámetro clave a pedir por el clínico]', 'mg/g creatinina', '> 1.6'],
    ],
    target: 'Pelagra por déficit de niacina',
    targetWhy:
      'Persona alcohólica y malnutrida con las «3 D»: dermatitis en zonas expuestas al sol (collar de Casal), diarrea y alteraciones de memoria, además de lengua roja.',
    differentials: [
      ['Encefalopatía de Wernicke (déficit de tiamina)', 'También aparece en alcohólicos y causa confusión, pero con alteraciones de los movimientos de los ojos y marcha inestable, sin dermatitis.'],
      ['Enfermedad de Hartnup', 'Da las mismas lesiones de piel, pero desde la infancia y en personas bien alimentadas.'],
      ['Enfermedad celíaca', 'Causa diarrea y malnutrición, pero sin dermatitis en zonas de sol ni este contexto.'],
    ],
    correct: [
      'bm_niacina_metabolitos',
      'N-metilnicotinamida en orina',
      'Refleja las reservas corporales de niacina.',
      'Confirma el déficit; en la práctica la mejoría rápida con niacina también lo confirma.',
    ],
    distractors: [
      ['bm_tiamina_transcetolasa', 'Transcetolasa eritrocitaria (tiamina)', 'Mide el déficit de vitamina B1.', 'Conviene comprobarlo en un alcohólico, pero no explica la dermatitis.'],
      ['bm_ttg_iga', 'Anticuerpos antitransglutaminasa', 'Cribado de celiaquía.', 'No hay datos que lo sugieran.'],
      ['bm_ggt', 'GGT', 'Marcador de consumo de alcohol.', 'Ya está alta; no diagnostica la pelagra.'],
    ],
    key:
      'La niacina (ácido nicotínico o nicotinamida) forma parte del NAD+ y del NADP+. La pelagra fue epidémica en zonas donde se comía casi solo maíz, pobre en triptófano y con la niacina en una forma que no se absorbe. Las culturas mesoamericanas evitaban la pelagra tratando el maíz con cal (nixtamalización), que libera la niacina. Hoy se ve sobre todo en alcohólicos, en la malabsorción y con algunos fármacos (isoniazida).',
    category: 'Vitaminas hidrosolubles como coenzimas',
    pathway: 'Niacina / triptófano -> NAD+ y NADP+ -> deshidrogenasas',
    alteration: 'Déficit nutricional de niacina y triptófano',
  },
  {
    id: 'case_baynes_escorbuto_01',
    title: 'Diego U. (9 años): Le sangran las encías y no quiere andar por el dolor de piernas',
    system: 'metabolic',
    difficulty: 'intermedio',
    summary:
      'Diego U., de 9 años, tiene autismo y desde hace dos años solo come galletas, leche y patatas fritas. Desde hace un mes le sangran las encías al cepillarse, le salen moratones con facilidad y se niega a caminar porque le duelen las piernas. Le falta vitamina C, necesaria para fabricar un colágeno resistente.',
    glossary: [
      ['Colágeno', 'Proteína más abundante del cuerpo. Da resistencia a la piel, los vasos, los huesos y las encías.'],
      ['Hidroxilación', 'Añadir un grupo -OH. En el colágeno, la prolina y la lisina deben hidroxilarse para que la triple hélice sea estable.'],
      ['Petequias', 'Pequeños puntos rojos en la piel por sangrado de capilares.'],
    ],
    concept:
      '1. El colágeno se fabrica como tres cadenas que se enrollan en una triple hélice -> 2. Para que la hélice sea estable, la prolina y la lisina tienen que hidroxilarse -> 3. Las enzimas que lo hacen necesitan vitamina C -> 4. Sin vitamina C el colágeno es débil -> 5. Los vasos se rompen con facilidad: encías que sangran, moratones, sangrado bajo el periostio (dolor de huesos) y mala cicatrización.',
    patient: { age: 9, gender: 'Masculino', occupation: 'Estudiante' },
    complaint: 'Encías que sangran, moratones y dolor de piernas que le impide caminar.',
    illness:
      'Diego U. tiene un trastorno del espectro autista con mucha selectividad para comer. Desde hace dos años solo acepta galletas, leche y patatas fritas de bolsa; rechaza toda la fruta y la verdura. Desde hace un mes le sangran las encías al cepillarse, tiene moratones en las piernas sin golpes claros y en la última semana no quiere andar y llora cuando le tocan las piernas. Está más cansado y pálido.',
    history: ['Trastorno del espectro autista', 'Alimentación muy selectiva desde hace 2 años'],
    meds: ['Ninguno'],
    lifestyle: 'Dieta sin fruta ni verdura.',
    vitals: ['100/62 mmHg', '96 lpm', '18 rpm', '36.6 °C', '99%'],
    exam: [
      ['Boca', 'Encías hinchadas, moradas y que sangran al tocarlas.'],
      ['Piel', 'Moratones en piernas y pequeños puntos rojos alrededor de los folículos del vello, con pelos enroscados «en sacacorchos».'],
      ['Piernas', 'Dolor intenso al palpar las piernas. Prefiere estar con las rodillas dobladas.'],
    ],
    labs: [
      ['Hemoglobina', '9.8', 'g/dL', '11.5 - 15.5'],
      ['Plaquetas', '260.000', '/µL', '150.000 - 450.000 (normales)'],
      ['Tiempo de protrombina y TTPA', 'Normales', '', 'Normales (la coagulación funciona)'],
      ['PCR', '3', 'mg/L', '< 5 (no hay inflamación)'],
      ['Vitamina C en plasma', '[NO SOLICITADO - Parámetro clave a pedir por el clínico]', 'mg/dL', '0.4 - 2.0'],
    ],
    target: 'Escorbuto (déficit de vitamina C)',
    targetWhy:
      'Niño con una dieta sin fruta ni verdura durante meses, con encías que sangran, moratones, petequias alrededor del vello, pelo en sacacorchos y dolor de piernas, con plaquetas y coagulación normales.',
    differentials: [
      ['Leucemia aguda', 'Debe descartarse ante un niño con moratones, palidez y dolor óseo, pero tendría plaquetas bajas y alteraciones en los leucocitos.'],
      ['Hemofilia', 'Da moratones y sangrados, pero el TTPA estaría alargado y no explicaría las encías ni el pelo.'],
      ['Maltrato infantil', 'Siempre hay que pensar en él ante moratones, pero aquí la dieta y las lesiones de encías y folículos explican el cuadro.'],
    ],
    correct: [
      'bm_vitamina_c',
      'Vitamina C en plasma',
      'Confirma que las reservas de ácido ascórbico están agotadas.',
      'Confirma el diagnóstico; la mejoría en pocos días con suplementos también lo apoya.',
    ],
    distractors: [
      ['bm_factor_viii', 'Factor VIII', 'Factor de la coagulación.', 'El TTPA es normal; no hay un problema de coagulación.'],
      ['bm_vitamina_b12', 'Vitamina B12', 'Necesaria para fabricar ADN en la médula.', 'La anemia aquí se explica por los sangrados y la mala dieta; no explica las encías ni los moratones.'],
      ['bm_ldh', 'LDH', 'Enzima intracelular inespecífica.', 'Subiría en una leucemia, pero no diagnostica el escorbuto.'],
    ],
    key:
      'La prolil y la lisil hidroxilasas tienen hierro en su centro activo, y la vitamina C lo mantiene en forma ferrosa (Fe2+) para que la enzima pueda trabajar. Sin hidroxiprolina no se forman suficientes puentes de hidrógeno y la triple hélice del colágeno se deshace a temperatura corporal. Los humanos, como los otros primates y las cobayas, no podemos fabricar vitamina C porque nos falta la última enzima de su síntesis. Hoy el escorbuto se ve en niños con dietas muy selectivas, en ancianos aislados y en alcohólicos.',
    category: 'Vitaminas y síntesis de colágeno',
    pathway: 'Procolágeno -> [prolil y lisil hidroxilasas + Fe2+ + vitamina C] -> hidroxiprolina e hidroxilisina -> triple hélice estable',
    alteration: 'Déficit nutricional de ácido ascórbico',
  },
];
