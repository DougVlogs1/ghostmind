const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://offlrpkfddmhtuycyzpu.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mZmxycGtmZGRtaHR1eWN5enB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5MTgwMzAsImV4cCI6MjA4MTQ5NDAzMH0.ypqffWVbb1Z0rPg2WywkNP0t-5nuBOvAyy30Q4qzbzA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkDuplicateLessons() {
  try {
    // Busca todas as lições ordenadas por module_id e title
    const { data: lessons, error } = await supabase
      .from('lessons')
      .select('id, module_id, title, order_index')
      .order('module_id')
      .order('order_index');
    
    if (error) {
      console.error('Erro ao buscar lições:', error);
      return;
    }
    
    console.log('Total de lições encontradas:', lessons.length);
    
    // Verifica lições duplicadas
    const seenLessons = {};
    const duplicates = [];
    
    lessons.forEach(lesson => {
      const key = `${lesson.module_id}-${lesson.title}`;
      if (seenLessons[key]) {
        duplicates.push({
          lesson1: seenLessons[key],
          lesson2: lesson
        });
      } else {
        seenLessons[key] = lesson;
      }
    });
    
    if (duplicates.length > 0) {
      console.log('\nLições duplicadas encontradas:');
      duplicates.forEach((dup, index) => {
        console.log(`${index + 1}. Módulo ${dup.lesson1.module_id}: "${dup.lesson1.title}"`);
        console.log(`   ID ${dup.lesson1.id} (ordem: ${dup.lesson1.order_index}) e ID ${dup.lesson2.id} (ordem: ${dup.lesson2.order_index})`);
      });
    } else {
      console.log('\nNenhuma lição duplicada encontrada.');
    }
    
    // Mostra todas as lições por módulo
    console.log('\n--- Lições por Módulo ---');
    const modules = {};
    lessons.forEach(lesson => {
      if (!modules[lesson.module_id]) {
        modules[lesson.module_id] = [];
      }
      modules[lesson.module_id].push(lesson);
    });
    
    Object.keys(modules).forEach(moduleId => {
      console.log(`\nMódulo ${moduleId}:`);
      modules[moduleId].forEach(lesson => {
        console.log(`  ${lesson.order_index}. ${lesson.title} (ID: ${lesson.id})`);
      });
    });
    
  } catch (err) {
    console.error('Erro ao executar verificação:', err);
  }
}

checkDuplicateLessons();