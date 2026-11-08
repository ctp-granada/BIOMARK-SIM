import { CaseSpec } from './caseBuilder';

// Casos basados en los pacientes del Baynes · Lípidos, proteínas plasmáticas y proteínas mal plegadas

export const BAYNES_CASES_4: CaseSpec[] = [
  {
    id: 'case_baynes_disbetalipoproteinemia_01',
    title: 'Fernando P. (52 años): Bultos amarillos en las rayas de las manos y dolor en las piernas al andar',
    system: 'metabolic',
    difficulty: 'avanzado',
    summary:
      'Fernando P., panadero de 52 años con sobrepeso, ha notado unas líneas amarillas en los pliegues de las palmas de las manos y unos bultos en los codos. Además, al caminar unos 200 metros le duelen las pantorrillas y tiene que pararse. Su colesterol y sus triglicéridos están altos a la vez. Su hígado no retira bien de la sangre los restos de las lipoproteínas ricas en grasa.',
    glossary: [
      ['Lipoproteína', 'Partícula que transporta grasas por la sangre. Las principales son quilomicrones, VLDL, LDL y HDL.'],
      ['Apolipoproteína E (apoE)', 'Proteína de la superficie de las lipoproteínas que el hígado reconoce para retirarlas de la sangre.'],
      ['Xantoma', 'Depósito de lípidos en la piel o los tendones, de color amarillento.'],
    ],
    concept:
      '1. Los quilomicrones y las VLDL ceden sus triglicéridos a los tejidos y quedan restos (remanentes) -> 2. El hígado los reconoce por la apoE y los retira -> 3. La variante apoE2 se une mal al receptor -> 4. Los remanentes, ricos en colesterol y triglicéridos, se acumulan en sangre -> 5. Se depositan en la piel (xantomas) y en las arterias (aterosclerosis).',
    patient: { age: 52, gender: 'Masculino', occupation: 'Panadero' },
    complaint: 'Manchas amarillas en las palmas, bultos en los codos y dolor en las pantorrillas al caminar.',
    illness:
      'Fernando P. ha notado en los últimos meses unas líneas amarillentas en los pliegues de las palmas y unos bultos indoloros en los codos. Desde hace medio año, al caminar unos 200 metros le duelen las pantorrillas y tiene que pararse; el dolor se le pasa al descansar. Ha ganado 10 kg en los últimos años y su médico le dijo que tenía «el azúcar algo alto».',
    history: ['Sobrepeso', 'Glucemia basal alterada', 'Padre con infarto a los 60 años'],
    meds: ['Ninguno'],
    lifestyle: 'Sedentario. Dieta rica en bollería y embutidos. Bebe 2-3 cervezas al día.',
    vitals: ['142/88 mmHg', '78 lpm', '14 rpm', '36.5 °C', '97%'],
    exam: [
      ['Piel', 'Líneas amarillentas en los pliegues de las palmas. Bultos amarillo-anaranjados en codos y rodillas.'],
      ['Pulsos', 'Pulsos de los pies débiles en ambos lados.'],
    ],
    labs: [
      ['Colesterol total', '390', 'mg/dL', '< 200'],
      ['Triglicéridos', '420', 'mg/dL', '< 150 (elevados casi en la misma medida que el colesterol)'],
      ['Glucemia', '118', 'mg/dL', '70 - 99'],
      ['TSH', '2.1', 'µU/mL', '0.4 - 4.0 (tiroides normal)'],
      ['Genotipo de apolipoproteína E', '[NO SOLICITADO - Parámetro clave a pedir por el clínico]', '', 'E3/E3'],
    ],
    target: 'Disbetalipoproteinemia familiar (hiperlipoproteinemia tipo III)',
    targetWhy:
      'Colesterol y triglicéridos elevados a la vez y en proporción parecida, xantomas en los pliegues palmares (muy característicos) y aterosclerosis periférica, en un hombre con sobrepeso, glucemia alta y alcohol como factores que la desencadenan.',
    differentials: [
      ['Hipercolesterolemia familiar', 'Eleva mucho el LDL y da xantomas en los tendones, pero con triglicéridos normales y no en las palmas.'],
      ['Hiperlipemia familiar combinada', 'También eleva colesterol y triglicéridos, pero no produce xantomas palmares.'],
      ['Hipotiroidismo', 'Puede elevar los lípidos, pero la TSH es normal.'],
    ],
    correct: [
      'bm_apoe_genotipo',
      'Genotipo de apolipoproteína E',
      'La homocigosis E2/E2 explica que el hígado no retire los remanentes.',
      'Confirma el diagnóstico y lo distingue de las otras hiperlipemias mixtas.',
    ],
    distractors: [
      ['bm_perfil_lipidico_completo', 'Perfil lipídico completo', 'Mide colesterol total, LDL, HDL y triglicéridos.', 'Confirma que hay una hiperlipemia mixta, pero no dice cuál.'],
      ['bm_hdl_apoa1', 'HDL y apoA-I', 'Diagnostican la enfermedad de Tangier.', 'No es el problema de Fernando.'],
      ['bm_hba1c', 'Hemoglobina glicada', 'Refleja la glucemia media.', 'Útil para valorar su glucosa, pero no explica los xantomas.'],
    ],
    key:
      'La apoE tiene tres variantes comunes (E2, E3 y E4). La E2 se une mucho peor al receptor de LDL y al receptor LRP1 del hígado. Ser E2/E2 es relativamente frecuente (1 de cada 100 personas), pero solo una pequeña parte desarrolla la enfermedad: hace falta un segundo factor que aumente la producción de VLDL, como obesidad, diabetes, alcohol o hipotiroidismo. Responde muy bien a la dieta, a perder peso y a los fibratos.',
    category: 'Lipoproteínas y transporte de lípidos',
    pathway: 'Quilomicrones y VLDL -> lipoproteína lipasa -> remanentes -> [captación hepática mediada por apoE, ALTERADA con apoE2] -> retirada de la sangre',
    alteration: 'Homocigosis para la isoforma apoE2, con un segundo factor que aumenta la producción de VLDL',
  },
  {
    id: 'case_baynes_tangier_01',
    title: 'Leire G. (9 años): Amígdalas enormes de color naranja y un bazo grande',
    system: 'metabolic',
    difficulty: 'experto',
    summary:
      'Leire G., de 9 años, ronca mucho y le cuesta tragar. El otorrino ve unas amígdalas enormes de un llamativo color amarillo-anaranjado. Además tiene el bazo grande. En su análisis, el HDL-colesterol prácticamente no existe. Sus células no pueden sacar el colesterol que les sobra hacia las HDL.',
    glossary: [
      ['HDL', 'Lipoproteína que recoge el colesterol sobrante de los tejidos y lo lleva al hígado (transporte inverso del colesterol).'],
      ['ABCA1', 'Transportador de la membrana que saca colesterol de las células hacia la apoA-I para formar HDL.'],
      ['Macrófago', 'Célula del sistema inmunitario que engulle restos y que puede llenarse de colesterol.'],
    ],
    concept:
      '1. Las células acumulan colesterol sobrante -> 2. El transportador ABCA1 debería pasarlo a la apoA-I -> 3. Sin ABCA1, la apoA-I no se carga y no se forman HDL -> 4. La apoA-I vacía se elimina rápido por el riñón -> 5. El colesterol queda en los macrófagos de amígdalas, bazo, hígado y nervios.',
    patient: { age: 9, gender: 'Femenino', occupation: 'Estudiante' },
    complaint: 'Ronquidos, dificultad para tragar y amígdalas muy grandes.',
    illness:
      'Leire G. ronca mucho desde hace dos años y últimamente se queja de que le cuesta tragar la carne. Su pediatra la envió al otorrino, que vio unas amígdalas muy grandes con un color amarillo-anaranjado característico. En la exploración también le palparon el bazo. No ha tenido anginas con fiebre. Sus padres son primos.',
    history: ['Padres primos hermanos', 'Sin infecciones de garganta frecuentes'],
    meds: ['Ninguno'],
    lifestyle: 'Dieta normal para su edad.',
    vitals: ['100/64 mmHg', '88 lpm', '18 rpm', '36.5 °C', '99%'],
    exam: [
      ['Garganta', 'Amígdalas muy grandes, con bandas amarillo-anaranjadas.'],
      ['Abdomen', 'Bazo palpable a 4 cm del reborde costal. Hígado algo aumentado.'],
      ['Ojos', 'Ligera opacidad en la córnea.'],
    ],
    labs: [
      ['Colesterol total', '82', 'mg/dL', '< 170 (bajo)'],
      ['Triglicéridos', '190', 'mg/dL', '< 90'],
      ['Plaquetas', '120.000', '/µL', '150.000 - 450.000 (algo bajas por el bazo grande)'],
      ['Frotis de sangre', 'Sin células anómalas', '', 'Normal'],
      ['HDL-colesterol y apoA-I', '[NO SOLICITADO - Parámetro clave a pedir por el clínico]', 'mg/dL', 'HDL > 40; apoA-I 120 - 180'],
    ],
    target: 'Enfermedad de Tangier (déficit del transportador ABCA1)',
    targetWhy:
      'Niña con amígdalas grandes de color anaranjado, bazo e hígado grandes, opacidad corneal, colesterol total bajo y padres consanguíneos.',
    differentials: [
      ['Hipertrofia amigdalar por infecciones', 'Es lo más frecuente, pero las amígdalas no son anaranjadas y no explica el bazo grande ni el colesterol bajo.'],
      ['Leucemia o linfoma', 'Pueden agrandar amígdalas y bazo, pero con alteraciones en el frotis de sangre.'],
      ['Enfermedad de Gaucher', 'También llena los macrófagos y agranda el bazo, pero por glucocerebrósido y sin alterar las HDL.'],
    ],
    correct: [
      'bm_hdl_apoa1',
      'HDL-colesterol y apolipoproteína A-I',
      'Un HDL casi nulo con apoA-I casi indetectable demuestra que no se forman HDL.',
      'Es el hallazgo bioquímico que define la enfermedad; se confirma con el estudio del gen ABCA1.',
    ],
    distractors: [
      ['bm_perfil_lipidico_completo', 'Perfil lipídico básico', 'Mide colesterol total, LDL, HDL y triglicéridos.', 'Orienta, pero no mide la apoA-I.'],
      ['bm_apoe_genotipo', 'Genotipo de apoE', 'Diagnostica la disbetalipoproteinemia.', 'No relacionado con el cuadro.'],
      ['bm_ldh', 'LDH', 'Enzima inespecífica.', 'Subiría en un linfoma, pero no diagnostica la enfermedad.'],
    ],
    key:
      'La HDL nace como apoA-I sola, sin lípidos. El ABCA1 usa ATP para pasarle fosfolípidos y colesterol de la membrana de la célula, y así forma la HDL. Después, la enzima LCAT esterifica ese colesterol y la HDL madura. Sin ABCA1 la apoA-I vacía se pierde por el riñón en horas. Fue descrita en dos hermanos de la isla de Tangier (Virginia, EE. UU.).',
    category: 'Lipoproteínas: HDL y transporte inverso del colesterol',
    pathway: 'Colesterol celular -> [ABCA1, DÉFICIT] -> apoA-I -> HDL naciente -> LCAT -> HDL madura -> hígado',
    alteration: 'Variantes del gen ABCA1 (herencia autosómica recesiva)',
  },
  {
    id: 'case_baynes_refsum_01',
    title: 'Víctor L. (32 años): No ve de noche, tropieza y tiene la piel como escamas',
    system: 'neuromuscular',
    difficulty: 'experto',
    summary:
      'Víctor L., carpintero de 32 años, ha dejado de conducir de noche porque apenas ve con poca luz. En el último año tropieza y pierde el equilibrio, siente los pies acorchados y tiene la piel seca y escamosa. Le encanta el queso y la carne de cordero. Su cuerpo no puede degradar el ácido fitánico de esos alimentos.',
    glossary: [
      ['Ácido fitánico', 'Ácido graso ramificado que llega con los lácteos, la carne de rumiantes y algunos pescados.'],
      ['Peroxisoma', 'Orgánulo que degrada ácidos grasos especiales, como los ramificados o los de cadena muy larga.'],
      ['α-oxidación', 'Ruta del peroxisoma que quita un solo carbono a un ácido graso ramificado para que después pueda seguir la β-oxidación.'],
    ],
    concept:
      '1. Lácteos y carne de rumiantes aportan ácido fitánico -> 2. Tiene una rama (grupo metilo) que impide la β-oxidación normal -> 3. El peroxisoma le quita primero un carbono por α-oxidación -> 4. Si esa enzima falta, el ácido fitánico se acumula en sangre y tejidos -> 5. Daña la retina, los nervios y la piel.',
    patient: { age: 32, gender: 'Masculino', occupation: 'Carpintero' },
    complaint: 'Mala visión con poca luz, inestabilidad al caminar y pies acorchados.',
    illness:
      'Víctor L. lleva años viendo mal en la oscuridad; hace un año dejó de conducir de noche. En los últimos 12 meses se tropieza, pierde el equilibrio en lugares con poca luz y nota los pies dormidos. Tiene la piel de piernas y espalda muy seca, con escamas. También oye algo peor. Come mucho queso curado, leche y carne de cordero.',
    history: ['Ceguera nocturna desde la adolescencia', 'Hermano con un problema de vista parecido'],
    meds: ['Cremas hidratantes'],
    lifestyle: 'Dieta rica en lácteos y cordero. No bebe alcohol.',
    vitals: ['124/78 mmHg', '70 lpm', '14 rpm', '36.5 °C', '98%'],
    exam: [
      ['Ojos', 'En el fondo de ojo, acúmulos de pigmento en la retina (retinosis pigmentaria). Campo visual reducido.'],
      ['Neurológico', 'Pérdida de sensibilidad en pies, reflejos de tobillo abolidos y marcha inestable.'],
      ['Piel', 'Descamación seca en piernas y tronco (ictiosis).'],
    ],
    labs: [
      ['Glucemia', '90', 'mg/dL', '70 - 110 (normal: no es una neuropatía diabética)'],
      ['Vitamina B12', '420', 'pg/mL', '200 - 900 (normal)'],
      ['Perfil lipídico', 'Normal', '', 'Normal'],
      ['Proteínas en LCR', '110', 'mg/dL', '15 - 45 (altas)'],
      ['Ácido fitánico en plasma', '[NO SOLICITADO - Parámetro clave a pedir por el clínico]', 'µmol/L', '< 10'],
    ],
    target: 'Enfermedad de Refsum del adulto (déficit de α-oxidación peroxisomal)',
    targetWhy:
      'Adulto joven con retinosis pigmentaria (ceguera nocturna), neuropatía periférica, inestabilidad, ictiosis y sordera, con glucemia y B12 normales y un hermano con problemas de visión.',
    differentials: [
      ['Neuropatía diabética', 'Produce pies acorchados, pero con glucemia alta y sin retinosis pigmentaria.'],
      ['Déficit de vitamina B12', 'Causa pérdida de sensibilidad e inestabilidad, pero la B12 es normal y no afecta a la retina.'],
      ['Retinosis pigmentaria aislada', 'Explica la ceguera nocturna, pero no la neuropatía ni la piel.'],
    ],
    correct: [
      'bm_acido_fitanico',
      'Ácido fitánico en plasma',
      'Demuestra la acumulación del ácido graso ramificado que el peroxisoma no puede degradar.',
      'Confirma el diagnóstico y sirve para vigilar la dieta.',
    ],
    distractors: [
      ['bm_vitamina_b12', 'Vitamina B12', 'Su déficit causa neuropatía.', 'Normal; descarta esa causa pero no da el diagnóstico.'],
      ['bm_perfil_acilcarnitinas', 'Perfil de acilcarnitinas', 'Detecta defectos de la β-oxidación mitocondrial.', 'Normal: el defecto está en el peroxisoma.'],
      ['bm_glucosa', 'Glucemia', 'Glucosa en sangre.', 'Normal; descarta la diabetes.'],
    ],
    key:
      'El ácido fitánico procede del fitol de la clorofila, que las bacterias del estómago de los rumiantes liberan; por eso está en lácteos, carne de vaca y cordero, y no tanto en las verduras. Su grupo metilo en el carbono 3 bloquea la β-oxidación. La fitanoil-CoA hidroxilasa del peroxisoma inicia la α-oxidación y quita un carbono; el producto, ácido pristánico, ya puede seguir la β-oxidación. El tratamiento es una dieta muy pobre en ácido fitánico y, en las crisis, plasmaféresis.',
    category: 'Oxidación de ácidos grasos en el peroxisoma',
    pathway: 'Ácido fitánico -> [fitanoil-CoA hidroxilasa, DÉFICIT] -> α-oxidación -> ácido pristánico -> β-oxidación',
    alteration: 'Variantes del gen PHYH (herencia autosómica recesiva)',
  },
  {
    id: 'case_baynes_wilson_01',
    title: 'Paula D. (17 años): Ojos amarillos, temblor en las manos y notas que bajan',
    system: 'hepatic',
    difficulty: 'avanzado',
    summary:
      'Paula D., de 17 años, siempre había sacado buenas notas, pero este curso ha bajado mucho, está irritable y le tiembla la mano al escribir. Hace una semana se le pusieron los ojos amarillos. El oftalmólogo ve un anillo dorado-marrón alrededor del iris. Su hígado no puede eliminar el cobre y lo está acumulando.',
    glossary: [
      ['Ceruloplasmina', 'Proteína del plasma que transporta la mayor parte del cobre de la sangre.'],
      ['ATP7B', 'Bomba del hepatocito que usa ATP para meter cobre en la ceruloplasmina y para echar el cobre sobrante a la bilis.'],
      ['Anillo de Kayser-Fleischer', 'Anillo marrón-dorado en el borde de la córnea por depósito de cobre.'],
    ],
    concept:
      '1. El cobre de la dieta llega al hígado -> 2. La bomba ATP7B lo carga en la ceruloplasmina y elimina el sobrante por la bilis -> 3. Si falla, el cobre se acumula dentro del hepatocito -> 4. Daña el hígado y se libera a la sangre como cobre libre -> 5. Se deposita en el cerebro (temblor, cambios de conducta) y en la córnea (anillo).',
    patient: { age: 17, gender: 'Femenino', occupation: 'Estudiante de bachillerato' },
    complaint: 'Color amarillo de piel y ojos desde hace una semana y temblor en las manos.',
    illness:
      'Paula D. era buena estudiante, pero desde hace 6 meses le cuesta concentrarse, sus notas han bajado y está muy irritable; sus padres pensaban que era la adolescencia. Desde hace unos meses le tiembla la mano derecha al escribir y su letra ha empeorado. Hace una semana se le pusieron los ojos amarillos y nota la tripa algo hinchada. No bebe alcohol ni toma medicamentos. No tiene fiebre.',
    history: ['Sin enfermedades previas', 'Un primo con «una enfermedad del hígado» de joven'],
    meds: ['Ninguno'],
    lifestyle: 'No bebe alcohol ni consume drogas.',
    vitals: ['106/66 mmHg', '92 lpm', '16 rpm', '36.8 °C', '98%'],
    exam: [
      ['Ojos', 'Ictericia. Anillo marrón-dorado en el borde de ambas córneas.'],
      ['Neurológico', 'Temblor de la mano derecha al mantener los brazos estirados. Habla algo lenta.'],
      ['Abdomen', 'Hígado palpable y blando. Leve ascitis.'],
    ],
    labs: [
      ['ALT / AST', '210 / 340', 'U/L', '< 40'],
      ['Bilirrubina total', '4.8', 'mg/dL', '< 1.2'],
      ['Hemoglobina', '9.9', 'g/dL', '12.0 - 15.5 (hemólisis por cobre libre)'],
      ['Serología de hepatitis virales', 'Negativa', '', 'Negativa'],
      ['Ceruloplasmina sérica', '[NO SOLICITADO - Parámetro clave a pedir por el clínico]', 'mg/dL', '20 - 45'],
    ],
    target: 'Enfermedad de Wilson',
    targetWhy:
      'Adolescente con hepatitis sin causa vírica ni tóxica, temblor, cambios de conducta y bajada del rendimiento escolar, anemia hemolítica y anillo de Kayser-Fleischer.',
    differentials: [
      ['Hepatitis vírica aguda', 'Da ictericia y transaminasas altas, pero la serología es negativa y no explica el temblor ni el anillo.'],
      ['Hepatitis autoinmune', 'Afecta a mujeres jóvenes y eleva las transaminasas, pero no causa síntomas neurológicos ni anillo corneal.'],
      ['Consumo de drogas', 'Podría explicar los cambios de conducta y el temblor, pero no la hepatitis con anillo de cobre.'],
    ],
    correct: [
      'bm_ceruloplasmina',
      'Ceruloplasmina sérica',
      'Si la ATP7B no carga cobre en la ceruloplasmina, esta se degrada y su nivel en sangre baja.',
      'Es la prueba de cribado; se completa con el cobre en orina de 24 horas y el estudio genético.',
    ],
    distractors: [
      ['bm_alt', 'ALT', 'Marcador de daño del hepatocito.', 'Ya sabemos que está alta; no indica la causa.'],
      ['bm_bilirrubina_directa', 'Bilirrubina directa', 'Orienta el tipo de ictericia.', 'Útil, pero no identifica la enfermedad.'],
      ['bm_albu_mina', 'Albúmina', 'Refleja la capacidad del hígado de fabricar proteínas.', 'Indica gravedad, no la causa.'],
    ],
    key:
      'La ATP7B es una ATPasa de tipo P que bombea cobre en el aparato de Golgi del hepatocito: allí lo incorpora a la ceruloplasmina y desde allí lo envía a la bilis, la única vía importante de eliminación del cobre. La ceruloplasmina sin cobre es inestable y se degrada, por eso baja en sangre. El tratamiento retira el cobre con quelantes (penicilamina, trientina) y reduce su absorción con zinc. Es una de las pocas enfermedades metabólicas del hígado curables con tratamiento si se diagnostica a tiempo.',
    category: 'Proteínas plasmáticas y transporte de metales',
    pathway: 'Cobre de la dieta -> hepatocito -> [ATP7B, DÉFICIT] -> ceruloplasmina y excreción biliar',
    alteration: 'Variantes del gen ATP7B (herencia autosómica recesiva)',
  },
  {
    id: 'case_baynes_nefrotico_01',
    title: 'Yago T. (5 años): Se levanta con los párpados hinchados y la orina hace mucha espuma',
    system: 'renal',
    difficulty: 'intermedio',
    summary:
      'Yago T., de 5 años, se levanta desde hace una semana con los párpados muy hinchados. Ahora también tiene hinchados los tobillos y la tripa, y su madre ha notado que la orina hace mucha espuma. Sus riñones están dejando escapar la albúmina de la sangre.',
    glossary: [
      ['Glomérulo', 'Ovillo de capilares del riñón donde se filtra la sangre. Normalmente no deja pasar proteínas grandes como la albúmina.'],
      ['Presión oncótica', 'Fuerza que ejercen las proteínas de la sangre, sobre todo la albúmina, para retener el agua dentro de los vasos.'],
      ['Proteinuria', 'Presencia de proteínas en la orina.'],
    ],
    concept:
      '1. El glomérulo dañado deja pasar la albúmina a la orina -> 2. La albúmina en sangre baja -> 3. Baja la presión oncótica y el agua sale de los vasos a los tejidos (edemas) -> 4. El hígado intenta compensar fabricando más proteínas y también más lipoproteínas -> 5. Edemas, orina espumosa, albúmina baja y colesterol alto.',
    patient: { age: 5, gender: 'Masculino', occupation: 'Escolar' },
    complaint: 'Párpados hinchados por las mañanas, tobillos y tripa hinchados, y orina con espuma.',
    illness:
      'Hace dos semanas Yago T. tuvo un catarro. Desde hace una semana se levanta con los párpados muy hinchados, que mejoran a lo largo del día. En los últimos días también tiene hinchados los tobillos y la tripa, y el pantalón le aprieta. Orina menos y la orina hace mucha espuma. No ha tenido fiebre ni la orina es roja.',
    history: ['Catarro hace dos semanas', 'Sin otras enfermedades'],
    meds: ['Ninguno'],
    lifestyle: 'Va al colegio. Come bien.',
    vitals: ['98/60 mmHg', '96 lpm', '22 rpm', '36.6 °C', '99%'],
    exam: [
      ['Cara', 'Párpados muy hinchados.'],
      ['Abdomen', 'Distendido, con líquido (ascitis).'],
      ['Extremidades', 'Edemas con fóvea en tobillos y piernas.'],
    ],
    labs: [
      ['Albúmina sérica', '1.8', 'g/dL', '3.5 - 5.0 (muy baja)'],
      ['Colesterol total', '380', 'mg/dL', '< 170 (alto)'],
      ['Creatinina', '0.4', 'mg/dL', '0.3 - 0.7 (función renal normal)'],
      ['Tira de orina', 'Proteínas ++++, sin sangre', '', 'Negativa'],
      ['Proteínas en orina de 24 horas o cociente proteínas/creatinina', '[NO SOLICITADO - Parámetro clave a pedir por el clínico]', 'mg/m²/h', '< 4'],
    ],
    target: 'Síndrome nefrótico (de cambios mínimos, el más frecuente en niños)',
    targetWhy:
      'Niño con edemas que empiezan en los párpados, orina espumosa, albúmina muy baja, colesterol alto y proteínas en la orina sin sangre, con función renal normal.',
    differentials: [
      ['Desnutrición proteica', 'También baja la albúmina y da edemas, pero Yago come bien y no hay proteínas en la orina.'],
      ['Insuficiencia hepática', 'El hígado fabrica poca albúmina, pero con ictericia y alteraciones de la coagulación.'],
      ['Síndrome nefrítico (glomerulonefritis tras infección)', 'También aparece tras una infección, pero con orina roja, hipertensión y poca proteína en la orina.'],
    ],
    correct: [
      'bm_proteinuria_24h',
      'Proteínas en orina de 24 horas (o cociente proteínas/creatinina)',
      'Cuantifica la albúmina que se escapa por el glomérulo.',
      'Una proteinuria en rango nefrótico confirma que la albúmina baja por pérdida renal.',
    ],
    distractors: [
      ['bm_albu_mina', 'Albúmina sérica', 'Principal proteína del plasma.', 'Ya sabemos que está baja; no dice si se pierde o no se fabrica.'],
      ['bm_creatinina', 'Creatinina', 'Marcador de filtrado renal.', 'Normal; el glomérulo filtra bien, pero deja pasar proteínas.'],
      ['bm_alt', 'ALT', 'Marcador de daño hepático.', 'No hay datos de enfermedad del hígado.'],
    ],
    key:
      'La albúmina es la proteína más abundante del plasma y la principal responsable de la presión oncótica. El filtro glomerular la retiene por su tamaño y por su carga negativa. En el síndrome de cambios mínimos se pierden las cargas negativas del filtro y la albúmina se escapa, aunque al microscopio óptico el riñón parece normal. El hígado responde fabricando más proteínas, entre ellas lipoproteínas: de ahí el colesterol alto. Responde muy bien a los corticoides.',
    category: 'Proteínas plasmáticas: albúmina y presión oncótica',
    pathway: 'Daño del filtro glomerular -> albuminuria -> hipoalbuminemia -> menor presión oncótica -> edema; síntesis hepática de lipoproteínas aumentada -> hipercolesterolemia',
    alteration: 'Pérdida de la barrera de carga y tamaño del glomérulo',
  },
  {
    id: 'case_baynes_creutzfeldt_jakob_01',
    title: 'Miguel Á. (64 años): Pierde la memoria en pocas semanas y tiene sacudidas al asustarse',
    system: 'neuromuscular',
    difficulty: 'experto',
    summary:
      'Miguel Á., ebanista jubilado de 64 años, estaba bien hace tres meses. Desde entonces su memoria ha empeorado mes a mes, se pierde en su propio barrio, camina inestable y tiene sacudidas bruscas de brazos cuando oye un ruido fuerte. Una proteína de su cerebro se ha plegado mal y está transformando a las demás.',
    glossary: [
      ['Prion', 'Proteína mal plegada capaz de transmitir su forma anómala a otras copias normales de la misma proteína.'],
      ['Hoja β plegada', 'Tipo de estructura secundaria de las proteínas. En exceso favorece que las proteínas se agrupen en fibras insolubles.'],
      ['Mioclonías', 'Sacudidas musculares bruscas e involuntarias.'],
    ],
    concept:
      '1. La proteína priónica normal (PrPC) tiene mucha hélice α -> 2. Una forma anómala (PrPSc), rica en hoja β, se une a ella -> 3. La obliga a cambiar a su misma forma -> 4. Se forman agregados insolubles que las proteasas no degradan -> 5. Las neuronas mueren y el cerebro queda lleno de agujeros (aspecto espongiforme).',
    patient: { age: 64, gender: 'Masculino', occupation: 'Ebanista jubilado' },
    complaint: 'Pérdida rápida de memoria, inestabilidad y sacudidas musculares.',
    illness:
      'Hace tres meses Miguel Á. empezó a olvidar citas y conversaciones. Al mes ya no sabía manejar el móvil y hace dos semanas se perdió volviendo de la panadería. Su mujer dice que «cada semana está peor». Ahora camina con las piernas abiertas, inestable, y tiene sacudidas bruscas de los brazos, sobre todo cuando se cierra una puerta de golpe. No ha tenido fiebre.',
    history: ['Hipertensión', 'Sin antecedentes familiares de demencia'],
    meds: ['Amlodipino 5 mg/día'],
    lifestyle: 'Hasta hace tres meses era totalmente independiente.',
    vitals: ['138/84 mmHg', '76 lpm', '14 rpm', '36.6 °C', '97%'],
    exam: [
      ['Mental', 'Desorientado en tiempo y lugar. No recuerda tres palabras a los cinco minutos.'],
      ['Neurológico', 'Marcha inestable. Sacudidas bruscas de los brazos al dar una palmada cerca de él.'],
    ],
    labs: [
      ['Glucemia, iones y calcio', 'Normales', '', 'Normales'],
      ['TSH y vitamina B12', 'Normales', '', 'Normales'],
      ['Células en LCR', '2', '/µL', '< 5 (no hay infección)'],
      ['Resonancia magnética', 'Señal alterada en la corteza cerebral y los ganglios basales', '', 'Normal'],
      ['Proteína priónica anómala en LCR (RT-QuIC)', '[NO SOLICITADO - Parámetro clave a pedir por el clínico]', '', 'Negativo'],
    ],
    target: 'Enfermedad de Creutzfeldt-Jakob esporádica',
    targetWhy:
      'Demencia que avanza en semanas, con inestabilidad, mioclonías provocadas por ruidos y resonancia característica, con análisis y LCR sin infección.',
    differentials: [
      ['Enfermedad de Alzheimer', 'Es la demencia más frecuente, pero avanza en años, no en semanas, y no suele dar mioclonías al principio.'],
      ['Encefalitis vírica o autoinmune', 'Puede dar deterioro rápido, pero suele haber fiebre o muchas células en el LCR.'],
      ['Déficit de vitamina B12 o hipotiroidismo', 'Son causas tratables de deterioro cognitivo, pero los análisis son normales.'],
    ],
    correct: [
      'bm_rt_quic_lcr',
      'Proteína priónica anómala en LCR (RT-QuIC)',
      'Amplifica en el laboratorio la capacidad de la PrPSc del paciente de convertir proteína normal.',
      'Muy específica; junto con la resonancia permite el diagnóstico sin biopsia.',
    ],
    distractors: [
      ['bm_vitamina_b12', 'Vitamina B12', 'Su déficit causa deterioro cognitivo tratable.', 'Ya es normal; descarta esa causa.'],
      ['bm_amonio_plasmatico', 'Amonio', 'Su aumento causa encefalopatía.', 'No hay enfermedad hepática que lo justifique.'],
      ['bm_glucosa_lcr', 'Glucosa en LCR', 'Baja en las meningitis bacterianas y el déficit de GLUT-1.', 'Será normal; no orienta el diagnóstico.'],
    ],
    key:
      'Los priones demuestran que la información para el plegamiento no siempre está solo en la secuencia: la misma cadena de aminoácidos puede adoptar dos formas estables, y la anómala hace de molde. La PrPSc es resistente a las proteasas y al calor. La mayoría de los casos son esporádicos; unos pocos son hereditarios, por transmisión médica (instrumental, injertos) o por comer carne de vacas con encefalopatía espongiforme (la variante de las «vacas locas»). No tiene tratamiento.',
    category: 'Estructura y plegamiento de proteínas',
    pathway: 'PrPC (hélice α) + PrPSc (hoja β) -> conversión de PrPC en PrPSc -> agregados resistentes a proteasas -> muerte neuronal',
    alteration: 'Cambio de plegamiento de la proteína priónica, sin cambio de secuencia en los casos esporádicos',
  },
];
