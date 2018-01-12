/*
 * Funcionalidades para los decoradores de parámetro
 * */
export class ParameterDecorator {

  /*
   * Obtener el primer método a ejecutar por si el método original tiene parámetros de decoradores
   * */
  static method(target: any, originalMethod: string) {
    // Tiene parámetros de decoradores
    if(typeof target[originalMethod+'__0'] != 'undefined') return originalMethod+'__0'
    // No tiene parámetros de decoradores
    else if(typeof target[originalMethod] != 'undefined') return originalMethod

    //
    return null
  }

  /*
   *
   * */
  static create_prototype(target: Object, propertyKey: string, parameterIndex: number, fn: any) {
    // Siguientes funciones
    let nextname = this.next_prototype(target.constructor.prototype, propertyKey)
    let nextname2 = this.next_prototype(target.constructor.prototype, propertyKey, 1)

    // Crea la nueva función
    target.constructor.prototype[nextname] = async function(data: any) {
      // Valor a insertar
      let value = fn(data)
      // Inserta el valor del parámetro
      ParameterDecorator.unshift_parameter(this, propertyKey, parameterIndex, value)

      // Si hay otro decorador, lo ejecuta (osea, el siguiente)
      if(typeof this[nextname2] != 'undefined' && parameterIndex != 0) await this[nextname2](data)

      // Es el último decorador disponible, llama a la función "original"
      if(parameterIndex == 0) {
        await this[propertyKey].apply(this, this[ParameterDecorator.get_arguments_array(propertyKey)])
      }
    }
  }

  /*
   * Obtener la siguiente función a ejecutar
   * */
  static next_prototype(prototype: any, propertyKey: string, add: number = 0) {
    // Desde donde inician el nombre de las funciones
    let i = 0

    // Recorrido infinito hasta que encuentre la función que no existe
    while(true) {
      // No existe la función
      if(!prototype[propertyKey+'__'+i]) return propertyKey+'__'+(i+add)

      //
      ++i
    }
  }

  /*
   * Inserta un valor de parámetro
   * */
  static unshift_parameter(instance: any, functionName, parameterIndex: number, value: any) {
    // El nombre del arreglo
    let arr: string = this.get_arguments_array(functionName)
    // Es el primer valor que se guarda
    if(!instance[arr]) instance[arr] = []

    // Inserta el nuevo valor
    instance[arr][parameterIndex] = value
  }

  /*
   * Obtener el nombre del contenedor de los valores de los parámetros
   * */
  static get_arguments_array(functionName: string) {
    return functionName+'__arguments'
  }
}
