def responder_lipo(msg):
    msg = msg.lower()
    focal = ["rollito", "zona", "banano", "sostén", "sosten", "puntual", "pequeñ", "brazo"]
    full = ["talla", "cuerpo", "todo", "abdomen", "guata", "panza", "completo", "bajar", "general"]

    if any(w in msg for w in focal):
        return "¡Perfecto! Para zonas específicas tu plan es la **Lipo Focalizada** ($348.800). Atacamos directo esa zona difícil. ¿Te gustaría agendar una evaluación?"
    
    if any(w in msg for w in full):
        return "Entiendo, buscas un cambio más notorio. 🔥 Tenemos planes intensivos como el **Lipo Express** o **Reductivo** (desde $432.000). ¿Te gustaría ver fotos de resultados para que veas lo que logramos?"
    
    return "¡Hola! 💖 En Body Elite tenemos protocolos de Lipo Sin Cirugía **desde $348.800**. Para darte el valor exacto, cuéntame: ¿Buscas eliminar un rollito puntual o reducir tallas en todo el cuerpo?"
