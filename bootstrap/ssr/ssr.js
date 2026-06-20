import { jsxs, jsx, Fragment as Fragment$1 } from "react/jsx-runtime";
import { config as config$1, isUrlMethodPair, mergeDataIntoQueryString, getScrollableParent, useInfiniteScroll, router, UseFormUtils, formDataToObject, FormComponentResetSymbol, resetFormFields, shouldIntercept, shouldNavigate, getInitialPageFromDOM, setupProgress, createHeadManager } from "@inertiajs/core";
import React2, { createContext, forwardRef, useRef, useMemo, useState, useEffect, useImperativeHandle, createElement, useCallback, useLayoutEffect, Fragment } from "react";
import { flushSync } from "react-dom";
import { cloneDeep, isEqual, set, has, get } from "lodash-es";
import { createValidator, toSimpleValidationErrors, resolveName } from "laravel-precognition";
import { LayoutDashboard, Package, Tag, CreditCard, ChevronDown, Menu, GripVertical, Star, Trash2, Plus, X, Check, Pencil, ShoppingCart, Minus, Heart } from "lucide-react";
import createServer from "@inertiajs/core/server";
import ReactDOMServer from "react-dom/server";
var headContext = createContext(null);
headContext.displayName = "InertiaHeadContext";
var HeadContext_default = headContext;
var pageContext = createContext(null);
pageContext.displayName = "InertiaPageContext";
var PageContext_default = pageContext;
var currentIsInitialPage = true;
var routerIsInitialized = false;
var swapComponent = async () => {
  currentIsInitialPage = false;
};
function App({
  children,
  initialPage,
  initialComponent,
  resolveComponent,
  titleCallback,
  onHeadUpdate
}) {
  const [current, setCurrent] = useState({
    component: initialComponent || null,
    page: { ...initialPage, flash: initialPage.flash ?? {} },
    key: null
  });
  const headManager = useMemo(() => {
    return createHeadManager(
      typeof window === "undefined",
      titleCallback || ((title) => title),
      onHeadUpdate || (() => {
      })
    );
  }, []);
  if (!routerIsInitialized) {
    router.init({
      initialPage,
      resolveComponent,
      swapComponent: async (args) => swapComponent(args),
      onFlash: (flash) => {
        setCurrent((current2) => ({
          ...current2,
          page: { ...current2.page, flash }
        }));
      }
    });
    routerIsInitialized = true;
  }
  useEffect(() => {
    swapComponent = async ({ component, page, preserveState }) => {
      if (currentIsInitialPage) {
        currentIsInitialPage = false;
        return;
      }
      flushSync(
        () => setCurrent((current2) => ({
          component,
          page,
          key: preserveState ? current2.key : Date.now()
        }))
      );
    };
    router.on("navigate", () => headManager.forceUpdate());
  }, []);
  if (!current.component) {
    return createElement(
      HeadContext_default.Provider,
      { value: headManager },
      createElement(PageContext_default.Provider, { value: current.page }, null)
    );
  }
  const renderChildren = children || (({ Component, props, key }) => {
    const child = createElement(Component, { key, ...props });
    if (typeof Component.layout === "function") {
      return Component.layout(child);
    }
    if (Array.isArray(Component.layout)) {
      return Component.layout.concat(child).reverse().reduce((children2, Layout2) => createElement(Layout2, { children: children2, ...props }));
    }
    return child;
  });
  return createElement(
    HeadContext_default.Provider,
    { value: headManager },
    createElement(
      PageContext_default.Provider,
      { value: current.page },
      renderChildren({
        Component: current.component,
        key: current.key,
        props: current.page.props
      })
    )
  );
}
App.displayName = "Inertia";
async function createInertiaApp({
  id = "app",
  resolve,
  setup,
  title,
  progress: progress2 = {},
  page,
  render,
  defaults = {}
}) {
  config.replace(defaults);
  const isServer = typeof window === "undefined";
  const useScriptElementForInitialPage = config.get("future.useScriptElementForInitialPage");
  const initialPage = page || getInitialPageFromDOM(id, useScriptElementForInitialPage);
  const resolveComponent = (name) => Promise.resolve(resolve(name)).then((module) => module.default || module);
  let head = [];
  const reactApp = await Promise.all([
    resolveComponent(initialPage.component),
    router.decryptHistory().catch(() => {
    })
  ]).then(([initialComponent]) => {
    const props = {
      initialPage,
      initialComponent,
      resolveComponent,
      titleCallback: title
    };
    if (isServer) {
      const ssrSetup = setup;
      return ssrSetup({
        el: null,
        App,
        props: { ...props, onHeadUpdate: (elements) => head = elements }
      });
    }
    const csrSetup = setup;
    return csrSetup({
      el: document.getElementById(id),
      App,
      props
    });
  });
  if (!isServer && progress2) {
    setupProgress(progress2);
  }
  if (isServer && render) {
    const element = () => {
      if (!useScriptElementForInitialPage) {
        return createElement(
          "div",
          {
            id,
            "data-page": JSON.stringify(initialPage)
          },
          reactApp
        );
      }
      return createElement(
        Fragment,
        null,
        createElement("script", {
          "data-page": id,
          type: "application/json",
          dangerouslySetInnerHTML: { __html: JSON.stringify(initialPage).replace(/\//g, "\\/") }
        }),
        createElement("div", { id }, reactApp)
      );
    };
    const body = await render(element());
    return { head, body };
  }
}
function useIsomorphicLayoutEffect(effect, deps) {
  typeof window === "undefined" ? useEffect(effect, deps) : useLayoutEffect(effect, deps);
}
var isReact19 = typeof React2.use === "function";
function usePage() {
  const page = isReact19 ? React2.use(PageContext_default) : React2.useContext(PageContext_default);
  if (!page) {
    throw new Error("usePage must be used within the Inertia component");
  }
  return page;
}
function useRemember(initialState, key, excludeKeysRef) {
  const [state, setState] = useState(() => {
    const restored = router.restore(key);
    return restored !== void 0 ? restored : initialState;
  });
  useEffect(() => {
    const keys = excludeKeysRef?.current;
    if (keys && keys.length > 0 && typeof state === "object" && state !== null) {
      const filtered = { ...state };
      keys.forEach((k) => delete filtered[k]);
      router.remember(filtered, key);
    } else {
      router.remember(state, key);
    }
  }, [state, key]);
  return [state, setState];
}
function useForm(...args) {
  const isMounted = useRef(false);
  const parsedArgs = UseFormUtils.parseUseFormArguments(...args);
  const { rememberKey, data: initialData } = parsedArgs;
  const precognitionEndpoint = useRef(parsedArgs.precognitionEndpoint);
  const [defaults, setDefaults] = useState(
    typeof initialData === "function" ? cloneDeep(initialData()) : cloneDeep(initialData)
  );
  const cancelToken = useRef(null);
  const recentlySuccessfulTimeoutId = useRef(void 0);
  const excludeKeysRef = useRef([]);
  const [data, setData] = rememberKey ? useRemember(defaults, `${rememberKey}:data`, excludeKeysRef) : useState(defaults);
  const [errors, setErrors] = rememberKey ? useRemember({}, `${rememberKey}:errors`) : useState({});
  const [hasErrors, setHasErrors] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [progress2, setProgress] = useState(null);
  const [wasSuccessful, setWasSuccessful] = useState(false);
  const [recentlySuccessful, setRecentlySuccessful] = useState(false);
  const transform = useRef((data2) => data2);
  const isDirty = useMemo(() => !isEqual(data, defaults), [data, defaults]);
  const validatorRef = useRef(null);
  const [validating, setValidating] = useState(false);
  const [touchedFields, setTouchedFields] = useState([]);
  const [validFields, setValidFields] = useState([]);
  const withAllErrors = useRef(null);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  const setDefaultsCalledInOnSuccess = useRef(false);
  const submit = useCallback(
    (...args2) => {
      const { method, url, options } = UseFormUtils.parseSubmitArguments(args2, precognitionEndpoint.current);
      setDefaultsCalledInOnSuccess.current = false;
      const _options = {
        ...options,
        onCancelToken: (token) => {
          cancelToken.current = token;
          if (options.onCancelToken) {
            return options.onCancelToken(token);
          }
        },
        onBefore: (visit) => {
          setWasSuccessful(false);
          setRecentlySuccessful(false);
          clearTimeout(recentlySuccessfulTimeoutId.current);
          if (options.onBefore) {
            return options.onBefore(visit);
          }
        },
        onStart: (visit) => {
          setProcessing(true);
          if (options.onStart) {
            return options.onStart(visit);
          }
        },
        onProgress: (event) => {
          setProgress(event || null);
          if (options.onProgress) {
            return options.onProgress(event);
          }
        },
        onSuccess: async (page) => {
          if (isMounted.current) {
            setProcessing(false);
            setProgress(null);
            setErrors({});
            setHasErrors(false);
            setWasSuccessful(true);
            setRecentlySuccessful(true);
            recentlySuccessfulTimeoutId.current = setTimeout(() => {
              if (isMounted.current) {
                setRecentlySuccessful(false);
              }
            }, config.get("form.recentlySuccessfulDuration"));
          }
          const onSuccess = options.onSuccess ? await options.onSuccess(page) : null;
          if (isMounted.current && !setDefaultsCalledInOnSuccess.current) {
            setData((data2) => {
              setDefaults(cloneDeep(data2));
              return data2;
            });
          }
          return onSuccess;
        },
        onError: (errors2) => {
          if (isMounted.current) {
            setProcessing(false);
            setProgress(null);
            setErrors(errors2);
            setHasErrors(Object.keys(errors2).length > 0);
            validatorRef.current?.setErrors(errors2);
          }
          if (options.onError) {
            return options.onError(errors2);
          }
        },
        onCancel: () => {
          if (isMounted.current) {
            setProcessing(false);
            setProgress(null);
          }
          if (options.onCancel) {
            return options.onCancel();
          }
        },
        onFinish: (visit) => {
          if (isMounted.current) {
            setProcessing(false);
            setProgress(null);
          }
          cancelToken.current = null;
          if (options.onFinish) {
            return options.onFinish(visit);
          }
        }
      };
      const transformedData = transform.current(data);
      if (method === "delete") {
        router.delete(url, { ..._options, data: transformedData });
      } else {
        router[method](url, transformedData, _options);
      }
    },
    [data, setErrors, transform]
  );
  const setDataFunction = useCallback(
    (keyOrData, maybeValue) => {
      if (typeof keyOrData === "string") {
        setData((data2) => set(cloneDeep(data2), keyOrData, maybeValue));
      } else if (typeof keyOrData === "function") {
        setData((data2) => keyOrData(data2));
      } else {
        setData(keyOrData);
      }
    },
    [setData]
  );
  const [dataAsDefaults, setDataAsDefaults] = useState(false);
  const dataRef = useRef(data);
  useEffect(() => {
    dataRef.current = data;
  });
  const setDefaultsFunction = useCallback(
    (fieldOrFields, maybeValue) => {
      setDefaultsCalledInOnSuccess.current = true;
      let newDefaults = {};
      if (typeof fieldOrFields === "undefined") {
        newDefaults = { ...dataRef.current };
        setDefaults(dataRef.current);
        setDataAsDefaults(true);
      } else {
        setDefaults((defaults2) => {
          newDefaults = typeof fieldOrFields === "string" ? set(cloneDeep(defaults2), fieldOrFields, maybeValue) : Object.assign(cloneDeep(defaults2), fieldOrFields);
          return newDefaults;
        });
      }
      validatorRef.current?.defaults(newDefaults);
    },
    [setDefaults]
  );
  useIsomorphicLayoutEffect(() => {
    if (!dataAsDefaults) {
      return;
    }
    if (isDirty) {
      setDefaults(data);
    }
    setDataAsDefaults(false);
  }, [dataAsDefaults]);
  const reset = useCallback(
    (...fields) => {
      if (fields.length === 0) {
        setData(defaults);
      } else {
        setData(
          (data2) => fields.filter((key) => has(defaults, key)).reduce(
            (carry, key) => {
              return set(carry, key, get(defaults, key));
            },
            { ...data2 }
          )
        );
      }
      validatorRef.current?.reset(...fields);
    },
    [setData, defaults]
  );
  const setError = useCallback(
    (fieldOrFields, maybeValue) => {
      setErrors((errors2) => {
        const newErrors = {
          ...errors2,
          ...typeof fieldOrFields === "string" ? { [fieldOrFields]: maybeValue } : fieldOrFields
        };
        setHasErrors(Object.keys(newErrors).length > 0);
        validatorRef.current?.setErrors(newErrors);
        return newErrors;
      });
    },
    [setErrors, setHasErrors]
  );
  const clearErrors = useCallback(
    (...fields) => {
      setErrors((errors2) => {
        const newErrors = Object.keys(errors2).reduce(
          (carry, field) => ({
            ...carry,
            ...fields.length > 0 && !fields.includes(field) ? { [field]: errors2[field] } : {}
          }),
          {}
        );
        setHasErrors(Object.keys(newErrors).length > 0);
        if (validatorRef.current) {
          if (fields.length === 0) {
            validatorRef.current.setErrors({});
          } else {
            fields.forEach(validatorRef.current.forgetError);
          }
        }
        return newErrors;
      });
    },
    [setErrors, setHasErrors]
  );
  const resetAndClearErrors = useCallback(
    (...fields) => {
      reset(...fields);
      clearErrors(...fields);
    },
    [reset, clearErrors]
  );
  const createSubmitMethod = (method) => (url, options = {}) => {
    submit(method, url, options);
  };
  const getMethod = useCallback(createSubmitMethod("get"), [submit]);
  const post = useCallback(createSubmitMethod("post"), [submit]);
  const put = useCallback(createSubmitMethod("put"), [submit]);
  const patch = useCallback(createSubmitMethod("patch"), [submit]);
  const deleteMethod = useCallback(createSubmitMethod("delete"), [submit]);
  const cancel = useCallback(() => {
    if (cancelToken.current) {
      cancelToken.current.cancel();
    }
  }, []);
  const transformFunction = useCallback((callback) => {
    transform.current = callback;
  }, []);
  const form = {
    data,
    setData: setDataFunction,
    isDirty,
    errors,
    hasErrors,
    processing,
    progress: progress2,
    wasSuccessful,
    recentlySuccessful,
    transform: transformFunction,
    setDefaults: setDefaultsFunction,
    reset,
    setError,
    clearErrors,
    resetAndClearErrors,
    submit,
    get: getMethod,
    post,
    put,
    patch,
    delete: deleteMethod,
    cancel,
    dontRemember: (...keys) => {
      excludeKeysRef.current = keys;
      return form;
    }
  };
  const tap = (value, callback) => {
    callback(value);
    return value;
  };
  const valid = useCallback(
    (field) => validFields.includes(field),
    [validFields]
  );
  const invalid = useCallback((field) => field in errors, [errors]);
  const touched = useCallback(
    (field) => typeof field === "string" ? touchedFields.includes(field) : touchedFields.length > 0,
    [touchedFields]
  );
  const validate = (field, config3) => {
    if (typeof field === "object" && !("target" in field)) {
      config3 = field;
      field = void 0;
    }
    if (field === void 0) {
      validatorRef.current.validate(config3);
    } else {
      const fieldName = resolveName(field);
      const currentData = dataRef.current;
      const transformedData = transform.current(currentData);
      validatorRef.current.validate(fieldName, get(transformedData, fieldName), config3);
    }
    return form;
  };
  const withPrecognition = (...args2) => {
    precognitionEndpoint.current = UseFormUtils.createWayfinderCallback(...args2);
    if (!validatorRef.current) {
      const validator = createValidator((client) => {
        const { method, url } = precognitionEndpoint.current();
        const currentData = dataRef.current;
        const transformedData = transform.current(currentData);
        return client[method](url, transformedData);
      }, cloneDeep(defaults));
      validatorRef.current = validator;
      validator.on("validatingChanged", () => {
        setValidating(validator.validating());
      }).on("validatedChanged", () => {
        setValidFields(validator.valid());
      }).on("touchedChanged", () => {
        setTouchedFields(validator.touched());
      }).on("errorsChanged", () => {
        const validationErrors = withAllErrors.current ?? config.get("form.withAllErrors") ? validator.errors() : toSimpleValidationErrors(validator.errors());
        setErrors(validationErrors);
        setHasErrors(Object.keys(validationErrors).length > 0);
        setValidFields(validator.valid());
      });
    }
    const precognitiveForm = Object.assign(form, {
      validating,
      validator: () => validatorRef.current,
      valid,
      invalid,
      touched,
      withoutFileValidation: () => tap(precognitiveForm, () => validatorRef.current?.withoutFileValidation()),
      touch: (field, ...fields) => {
        if (Array.isArray(field)) {
          validatorRef.current?.touch(field);
        } else if (typeof field === "string") {
          validatorRef.current?.touch([field, ...fields]);
        } else {
          validatorRef.current?.touch(field);
        }
        return precognitiveForm;
      },
      withAllErrors: () => tap(precognitiveForm, () => withAllErrors.current = true),
      setValidationTimeout: (duration) => tap(precognitiveForm, () => validatorRef.current?.setTimeout(duration)),
      validateFiles: () => tap(precognitiveForm, () => validatorRef.current?.validateFiles()),
      validate,
      setErrors: (errors2) => tap(precognitiveForm, () => form.setError(errors2)),
      forgetError: (field) => tap(
        precognitiveForm,
        () => form.clearErrors(resolveName(field))
      )
    });
    return precognitiveForm;
  };
  form.withPrecognition = withPrecognition;
  return precognitionEndpoint.current ? form.withPrecognition(precognitionEndpoint.current) : form;
}
var deferStateUpdate = (callback) => {
  typeof React2.startTransition === "function" ? React2.startTransition(callback) : setTimeout(callback, 0);
};
var noop = () => void 0;
var FormContext = createContext(void 0);
var Form = forwardRef(
  ({
    action = "",
    method = "get",
    headers = {},
    queryStringArrayFormat = "brackets",
    errorBag = null,
    showProgress = true,
    transform = (data) => data,
    options = {},
    onStart = noop,
    onProgress = noop,
    onFinish = noop,
    onBefore = noop,
    onCancel = noop,
    onSuccess = noop,
    onError = noop,
    onCancelToken = noop,
    onSubmitComplete = noop,
    disableWhileProcessing = false,
    resetOnError = false,
    resetOnSuccess = false,
    setDefaultsOnSuccess = false,
    invalidateCacheTags = [],
    validateFiles = false,
    validationTimeout = 1500,
    withAllErrors = null,
    children,
    ...props
  }, ref) => {
    const getTransformedData = () => {
      const [_url, data] = getUrlAndData();
      return transform(data);
    };
    const form = useForm({}).withPrecognition(
      () => resolvedMethod,
      () => getUrlAndData()[0]
    ).setValidationTimeout(validationTimeout);
    if (validateFiles) {
      form.validateFiles();
    }
    if (withAllErrors ?? config$1.get("form.withAllErrors")) {
      form.withAllErrors();
    }
    form.transform(getTransformedData);
    const formElement = useRef(void 0);
    const resolvedMethod = useMemo(() => {
      return isUrlMethodPair(action) ? action.method : method.toLowerCase();
    }, [action, method]);
    const [isDirty, setIsDirty] = useState(false);
    const defaultData = useRef(new FormData());
    const getFormData = (submitter) => new FormData(formElement.current, submitter);
    const getData = (submitter) => formDataToObject(getFormData(submitter));
    const getUrlAndData = (submitter) => {
      return mergeDataIntoQueryString(
        resolvedMethod,
        isUrlMethodPair(action) ? action.url : action,
        getData(submitter),
        queryStringArrayFormat
      );
    };
    const updateDirtyState = (event) => {
      if (event.type === "reset" && event.detail?.[FormComponentResetSymbol]) {
        event.preventDefault();
      }
      deferStateUpdate(
        () => setIsDirty(event.type === "reset" ? false : !isEqual(getData(), formDataToObject(defaultData.current)))
      );
    };
    const clearErrors = (...names) => {
      form.clearErrors(...names);
      return form;
    };
    useEffect(() => {
      defaultData.current = getFormData();
      form.setDefaults(getData());
      const formEvents = ["input", "change", "reset"];
      formEvents.forEach((e) => formElement.current.addEventListener(e, updateDirtyState));
      return () => {
        formEvents.forEach((e) => formElement.current?.removeEventListener(e, updateDirtyState));
      };
    }, []);
    useEffect(() => {
      form.setValidationTimeout(validationTimeout);
    }, [validationTimeout]);
    useEffect(() => {
      if (validateFiles) {
        form.validateFiles();
      } else {
        form.withoutFileValidation();
      }
    }, [validateFiles]);
    const reset = (...fields) => {
      if (formElement.current) {
        resetFormFields(formElement.current, defaultData.current, fields);
      }
      form.reset(...fields);
    };
    const resetAndClearErrors = (...fields) => {
      clearErrors(...fields);
      reset(...fields);
    };
    const maybeReset = (resetOption) => {
      if (!resetOption) {
        return;
      }
      if (resetOption === true) {
        reset();
      } else if (resetOption.length > 0) {
        reset(...resetOption);
      }
    };
    const submit = (submitter) => {
      const [url, data] = getUrlAndData(submitter);
      const formTarget = submitter?.getAttribute("formtarget");
      if (formTarget === "_blank" && resolvedMethod === "get") {
        window.open(url, "_blank");
        return;
      }
      const submitOptions = {
        headers,
        queryStringArrayFormat,
        errorBag,
        showProgress,
        invalidateCacheTags,
        onCancelToken,
        onBefore,
        onStart,
        onProgress,
        onFinish,
        onCancel,
        onSuccess: (...args) => {
          onSuccess(...args);
          onSubmitComplete({
            reset,
            defaults
          });
          maybeReset(resetOnSuccess);
          if (setDefaultsOnSuccess === true) {
            defaults();
          }
        },
        onError(...args) {
          onError(...args);
          maybeReset(resetOnError);
        },
        ...options
      };
      form.transform(() => transform(data));
      form.submit(resolvedMethod, url, submitOptions);
      form.transform(getTransformedData);
    };
    const defaults = () => {
      defaultData.current = getFormData();
      setIsDirty(false);
    };
    const exposed = {
      errors: form.errors,
      hasErrors: form.hasErrors,
      processing: form.processing,
      progress: form.progress,
      wasSuccessful: form.wasSuccessful,
      recentlySuccessful: form.recentlySuccessful,
      isDirty,
      clearErrors,
      resetAndClearErrors,
      setError: form.setError,
      reset,
      submit,
      defaults,
      getData,
      getFormData,
      // Precognition
      validator: () => form.validator(),
      validating: form.validating,
      valid: form.valid,
      invalid: form.invalid,
      validate: (field, config3) => form.validate(...UseFormUtils.mergeHeadersForValidation(field, config3, headers)),
      touch: form.touch,
      touched: form.touched
    };
    useImperativeHandle(ref, () => exposed, [form, isDirty, submit]);
    const formNode = createElement(
      "form",
      {
        ...props,
        ref: formElement,
        action: isUrlMethodPair(action) ? action.url : action,
        method: resolvedMethod,
        onSubmit: (event) => {
          event.preventDefault();
          submit(event.nativeEvent.submitter);
        },
        // React 19 supports passing a boolean to the `inert` attribute, but shows
        // a warning when receiving a string. Earlier versions require the string 'true'.
        // See: https://github.com/inertiajs/inertia/pull/2536
        inert: disableWhileProcessing && form.processing && (isReact19 ? true : "true")
      },
      typeof children === "function" ? children(exposed) : children
    );
    return createElement(FormContext.Provider, { value: exposed }, formNode);
  }
);
Form.displayName = "InertiaForm";
var resolveHTMLElement = (value, fallback) => {
  if (!value) {
    return fallback;
  }
  if (value && typeof value === "object" && "current" in value) {
    return value.current;
  }
  if (typeof value === "string") {
    return document.querySelector(value);
  }
  return fallback;
};
var renderSlot = (slotContent, slotProps, fallback = null) => {
  if (!slotContent) {
    return fallback;
  }
  return typeof slotContent === "function" ? slotContent(slotProps) : slotContent;
};
var InfiniteScroll = forwardRef(
  ({
    data,
    buffer = 0,
    as = "div",
    manual = false,
    manualAfter = 0,
    preserveUrl = false,
    reverse = false,
    autoScroll,
    children,
    startElement,
    endElement,
    itemsElement,
    previous,
    next,
    loading,
    onlyNext = false,
    onlyPrevious = false,
    ...props
  }, ref) => {
    const [startElementFromRef, setStartElementFromRef] = useState(null);
    const startElementRef = useCallback((node) => setStartElementFromRef(node), []);
    const [endElementFromRef, setEndElementFromRef] = useState(null);
    const endElementRef = useCallback((node) => setEndElementFromRef(node), []);
    const [itemsElementFromRef, setItemsElementFromRef] = useState(null);
    const itemsElementRef = useCallback((node) => setItemsElementFromRef(node), []);
    const [loadingPrevious, setLoadingPrevious] = useState(false);
    const [loadingNext, setLoadingNext] = useState(false);
    const [requestCount, setRequestCount] = useState(0);
    const [hasPreviousPage, setHasPreviousPage] = useState(false);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [resolvedStartElement, setResolvedStartElement] = useState(null);
    const [resolvedEndElement, setResolvedEndElement] = useState(null);
    const [resolvedItemsElement, setResolvedItemsElement] = useState(null);
    useEffect(() => {
      const element = startElement ? resolveHTMLElement(startElement, startElementFromRef) : startElementFromRef;
      setResolvedStartElement(element);
    }, [startElement, startElementFromRef]);
    useEffect(() => {
      const element = endElement ? resolveHTMLElement(endElement, endElementFromRef) : endElementFromRef;
      setResolvedEndElement(element);
    }, [endElement, endElementFromRef]);
    useEffect(() => {
      const element = itemsElement ? resolveHTMLElement(itemsElement, itemsElementFromRef) : itemsElementFromRef;
      setResolvedItemsElement(element);
    }, [itemsElement, itemsElementFromRef]);
    const scrollableParent = useMemo(() => getScrollableParent(resolvedItemsElement), [resolvedItemsElement]);
    const callbackPropsRef = useRef({
      buffer,
      onlyNext,
      onlyPrevious,
      reverse,
      preserveUrl
    });
    callbackPropsRef.current = {
      buffer,
      onlyNext,
      onlyPrevious,
      reverse,
      preserveUrl
    };
    const [infiniteScroll, setInfiniteScroll] = useState(null);
    const dataManager = useMemo(() => infiniteScroll?.dataManager, [infiniteScroll]);
    const elementManager = useMemo(() => infiniteScroll?.elementManager, [infiniteScroll]);
    const scrollToBottom = useCallback(() => {
      if (scrollableParent) {
        scrollableParent.scrollTo({
          top: scrollableParent.scrollHeight,
          behavior: "instant"
        });
      } else {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "instant"
        });
      }
    }, [scrollableParent]);
    useEffect(() => {
      if (!resolvedItemsElement) {
        return;
      }
      function syncStateFromDataManager() {
        setRequestCount(infiniteScrollInstance.dataManager.getRequestCount());
        setHasPreviousPage(infiniteScrollInstance.dataManager.hasPrevious());
        setHasNextPage(infiniteScrollInstance.dataManager.hasNext());
      }
      const infiniteScrollInstance = useInfiniteScroll({
        // Data
        getPropName: () => data,
        inReverseMode: () => callbackPropsRef.current.reverse,
        shouldFetchNext: () => !callbackPropsRef.current.onlyPrevious,
        shouldFetchPrevious: () => !callbackPropsRef.current.onlyNext,
        shouldPreserveUrl: () => callbackPropsRef.current.preserveUrl,
        // Elements
        getTriggerMargin: () => callbackPropsRef.current.buffer,
        getStartElement: () => resolvedStartElement,
        getEndElement: () => resolvedEndElement,
        getItemsElement: () => resolvedItemsElement,
        getScrollableParent: () => scrollableParent,
        // Callbacks
        onBeforePreviousRequest: () => setLoadingPrevious(true),
        onBeforeNextRequest: () => setLoadingNext(true),
        onCompletePreviousRequest: () => {
          setLoadingPrevious(false);
          syncStateFromDataManager();
        },
        onCompleteNextRequest: () => {
          setLoadingNext(false);
          syncStateFromDataManager();
        },
        onDataReset: syncStateFromDataManager
      });
      setInfiniteScroll(infiniteScrollInstance);
      const { dataManager: dataManager2, elementManager: elementManager2 } = infiniteScrollInstance;
      syncStateFromDataManager();
      elementManager2.setupObservers();
      elementManager2.processServerLoadedElements(dataManager2.getLastLoadedPage());
      if (autoLoad) {
        elementManager2.enableTriggers();
      }
      return () => {
        infiniteScrollInstance.flush();
        setInfiniteScroll(null);
      };
    }, [data, resolvedItemsElement, resolvedStartElement, resolvedEndElement, scrollableParent]);
    const manualMode = useMemo(
      () => manual || manualAfter > 0 && requestCount >= manualAfter,
      [manual, manualAfter, requestCount]
    );
    const autoLoad = useMemo(() => !manualMode, [manualMode]);
    useEffect(() => {
      autoLoad ? elementManager?.enableTriggers() : elementManager?.disableTriggers();
    }, [autoLoad, onlyNext, onlyPrevious, resolvedStartElement, resolvedEndElement]);
    useEffect(() => {
      const shouldAutoScroll = autoScroll !== void 0 ? autoScroll : reverse;
      if (shouldAutoScroll) {
        scrollToBottom();
      }
    }, [scrollableParent]);
    useImperativeHandle(
      ref,
      () => ({
        fetchNext: dataManager?.fetchNext || (() => {
        }),
        fetchPrevious: dataManager?.fetchPrevious || (() => {
        }),
        hasPrevious: dataManager?.hasPrevious || (() => false),
        hasNext: dataManager?.hasNext || (() => false)
      }),
      [dataManager]
    );
    const headerAutoMode = autoLoad && !onlyNext;
    const footerAutoMode = autoLoad && !onlyPrevious;
    const sharedExposed = {
      loadingPrevious,
      loadingNext,
      hasPrevious: hasPreviousPage,
      hasNext: hasNextPage
    };
    const exposedPrevious = {
      loading: loadingPrevious,
      fetch: dataManager?.fetchPrevious ?? (() => {
      }),
      autoMode: headerAutoMode,
      manualMode: !headerAutoMode,
      hasMore: hasPreviousPage,
      ...sharedExposed
    };
    const exposedNext = {
      loading: loadingNext,
      fetch: dataManager?.fetchNext ?? (() => {
      }),
      autoMode: footerAutoMode,
      manualMode: !footerAutoMode,
      hasMore: hasNextPage,
      ...sharedExposed
    };
    const exposedSlot = {
      loading: loadingPrevious || loadingNext,
      loadingPrevious,
      loadingNext
    };
    const renderElements = [];
    if (!startElement) {
      renderElements.push(
        createElement(
          "div",
          { ref: startElementRef },
          // Render previous slot or fallback to loading indicator
          renderSlot(previous, exposedPrevious, loadingPrevious ? renderSlot(loading, exposedPrevious) : null)
        )
      );
    }
    renderElements.push(
      createElement(
        as,
        { ...props, ref: itemsElementRef },
        typeof children === "function" ? children(exposedSlot) : children
      )
    );
    if (!endElement) {
      renderElements.push(
        createElement(
          "div",
          { ref: endElementRef },
          // Render next slot or fallback to loading indicator
          renderSlot(next, exposedNext, loadingNext ? renderSlot(loading, exposedNext) : null)
        )
      );
    }
    return createElement(React2.Fragment, {}, ...reverse ? [...renderElements].reverse() : renderElements);
  }
);
InfiniteScroll.displayName = "InertiaInfiniteScroll";
var noop2 = () => void 0;
var Link = forwardRef(
  ({
    children,
    as = "a",
    data = {},
    href = "",
    method = "get",
    preserveScroll = false,
    preserveState = null,
    preserveUrl = false,
    replace = false,
    only = [],
    except = [],
    headers = {},
    queryStringArrayFormat = "brackets",
    async = false,
    onClick = noop2,
    onCancelToken = noop2,
    onBefore = noop2,
    onStart = noop2,
    onProgress = noop2,
    onFinish = noop2,
    onCancel = noop2,
    onSuccess = noop2,
    onError = noop2,
    onPrefetching = noop2,
    onPrefetched = noop2,
    prefetch = false,
    cacheFor = 0,
    cacheTags = [],
    viewTransition = false,
    ...props
  }, ref) => {
    const [inFlightCount, setInFlightCount] = useState(0);
    const hoverTimeout = useRef(void 0);
    const _method = useMemo(() => {
      return isUrlMethodPair(href) ? href.method : method.toLowerCase();
    }, [href, method]);
    const _as = useMemo(() => {
      if (typeof as !== "string" || as.toLowerCase() !== "a") {
        return as;
      }
      return _method !== "get" ? "button" : as.toLowerCase();
    }, [as, _method]);
    const mergeDataArray = useMemo(
      () => mergeDataIntoQueryString(_method, isUrlMethodPair(href) ? href.url : href, data, queryStringArrayFormat),
      [href, _method, data, queryStringArrayFormat]
    );
    const url = useMemo(() => mergeDataArray[0], [mergeDataArray]);
    const _data = useMemo(() => mergeDataArray[1], [mergeDataArray]);
    const baseParams = useMemo(
      () => ({
        data: _data,
        method: _method,
        preserveScroll,
        preserveState: preserveState ?? _method !== "get",
        preserveUrl,
        replace,
        only,
        except,
        headers,
        async
      }),
      [_data, _method, preserveScroll, preserveState, preserveUrl, replace, only, except, headers, async]
    );
    const visitParams = useMemo(
      () => ({
        ...baseParams,
        viewTransition,
        onCancelToken,
        onBefore,
        onStart(visit) {
          setInFlightCount((count) => count + 1);
          onStart(visit);
        },
        onProgress,
        onFinish(visit) {
          setInFlightCount((count) => count - 1);
          onFinish(visit);
        },
        onCancel,
        onSuccess,
        onError
      }),
      [
        baseParams,
        viewTransition,
        onCancelToken,
        onBefore,
        onStart,
        onProgress,
        onFinish,
        onCancel,
        onSuccess,
        onError
      ]
    );
    const prefetchModes = useMemo(
      () => {
        if (prefetch === true) {
          return ["hover"];
        }
        if (prefetch === false) {
          return [];
        }
        if (Array.isArray(prefetch)) {
          return prefetch;
        }
        return [prefetch];
      },
      Array.isArray(prefetch) ? prefetch : [prefetch]
    );
    const cacheForValue = useMemo(() => {
      if (cacheFor !== 0) {
        return cacheFor;
      }
      if (prefetchModes.length === 1 && prefetchModes[0] === "click") {
        return 0;
      }
      return config.get("prefetch.cacheFor");
    }, [cacheFor, prefetchModes]);
    const doPrefetch = useMemo(() => {
      return () => {
        router.prefetch(
          url,
          {
            ...baseParams,
            onPrefetching,
            onPrefetched
          },
          { cacheFor: cacheForValue, cacheTags }
        );
      };
    }, [url, baseParams, onPrefetching, onPrefetched, cacheForValue, cacheTags]);
    useEffect(() => {
      return () => {
        clearTimeout(hoverTimeout.current);
      };
    }, []);
    useEffect(() => {
      if (prefetchModes.includes("mount")) {
        setTimeout(() => doPrefetch());
      }
    }, prefetchModes);
    const regularEvents = {
      onClick: (event) => {
        onClick(event);
        if (shouldIntercept(event)) {
          event.preventDefault();
          router.visit(url, visitParams);
        }
      }
    };
    const prefetchHoverEvents = {
      onMouseEnter: () => {
        hoverTimeout.current = window.setTimeout(() => {
          doPrefetch();
        }, config.get("prefetch.hoverDelay"));
      },
      onMouseLeave: () => {
        clearTimeout(hoverTimeout.current);
      },
      onClick: regularEvents.onClick
    };
    const prefetchClickEvents = {
      onMouseDown: (event) => {
        if (shouldIntercept(event)) {
          event.preventDefault();
          doPrefetch();
        }
      },
      onKeyDown: (event) => {
        if (shouldNavigate(event)) {
          event.preventDefault();
          doPrefetch();
        }
      },
      onMouseUp: (event) => {
        if (shouldIntercept(event)) {
          event.preventDefault();
          router.visit(url, visitParams);
        }
      },
      onKeyUp: (event) => {
        if (shouldNavigate(event)) {
          event.preventDefault();
          router.visit(url, visitParams);
        }
      },
      onClick: (event) => {
        onClick(event);
        if (shouldIntercept(event)) {
          event.preventDefault();
        }
      }
    };
    const elProps = useMemo(() => {
      if (_as === "button") {
        return { type: "button" };
      }
      if (_as === "a" || typeof _as !== "string") {
        return { href: url };
      }
      return {};
    }, [_as, url]);
    return createElement(
      _as,
      {
        ...props,
        ...elProps,
        ref,
        ...(() => {
          if (prefetchModes.includes("hover")) {
            return prefetchHoverEvents;
          }
          if (prefetchModes.includes("click")) {
            return prefetchClickEvents;
          }
          return regularEvents;
        })(),
        "data-loading": inFlightCount > 0 ? "" : void 0
      },
      children
    );
  }
);
Link.displayName = "InertiaLink";
var Link_default = Link;
var router3 = router;
var config = config$1.extend();
const menuItems = [
  {
    label: "Главная",
    icon: LayoutDashboard,
    href: "/admin"
  },
  {
    label: "Товары",
    icon: Package,
    children: [
      { label: "Список товаров", href: "/admin/products" },
      { label: "Новый товар", href: "/admin/products/create" }
    ]
  },
  {
    label: "Категории",
    icon: Tag,
    children: [
      { label: "Список категорий", href: "/admin/categories" },
      { label: "Новая категория", href: "/admin/categories/create" }
    ]
  },
  {
    label: "Карточки",
    icon: CreditCard,
    children: [
      { label: "Список карточек", href: "/admin/cards" },
      { label: "Новая карточка", href: "/admin/cards/create" }
    ]
  }
];
function Layout({ children, title }) {
  const { url, props } = usePage();
  const flash = props.flash;
  const [openGroups, setOpenGroups] = useState(() => {
    try {
      const saved = localStorage.getItem("adminOpenGroups");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const toggleGroup = (label) => {
    setOpenGroups((prev) => {
      const next = { ...prev, [label]: !prev[label] };
      localStorage.setItem("adminOpenGroups", JSON.stringify(next));
      return next;
    });
  };
  const isExactActive = (href) => url === href;
  const isChildActive = (href) => url === href;
  const isGroupActive = (children2) => children2.some((c) => isChildActive(c.href));
  return /* @__PURE__ */ jsxs("div", { className: "admin-wrapper", children: [
    flash?.success && /* @__PURE__ */ jsx("div", { className: "flash flash-success", children: flash.success }),
    flash?.error && /* @__PURE__ */ jsx("div", { className: "flash flash-error", children: flash.error }),
    /* @__PURE__ */ jsxs("aside", { className: `sidebar ${sidebarOpen ? "open" : "closed"}`, children: [
      /* @__PURE__ */ jsx("div", { className: "sidebar-logo", children: /* @__PURE__ */ jsx("span", { children: "ЗОЛУШКАМ.NET" }) }),
      /* @__PURE__ */ jsx("nav", { className: "sidebar-nav", children: menuItems.map((item) => {
        const Icon = item.icon;
        if (!item.children) {
          return /* @__PURE__ */ jsxs(
            Link_default,
            {
              href: item.href,
              className: `nav-element ${isExactActive(item.href) ? "active" : ""}`,
              children: [
                /* @__PURE__ */ jsx(Icon, { size: 18 }),
                item.label
              ]
            },
            item.label
          );
        }
        const groupActive = isGroupActive(item.children);
        const groupOpen = openGroups[item.label] ?? groupActive;
        return /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => toggleGroup(item.label),
              className: `nav-element ${groupActive ? "parent-active" : ""}`,
              children: [
                /* @__PURE__ */ jsx(Icon, { size: 18 }),
                /* @__PURE__ */ jsx("span", { children: item.label }),
                /* @__PURE__ */ jsx(
                  ChevronDown,
                  {
                    size: 16,
                    className: `nav-arrow ${groupOpen ? "rotated" : ""}`
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsx("div", { className: `nav-submenu ${groupOpen ? "open" : ""}`, children: item.children.map((child) => /* @__PURE__ */ jsxs(
            Link_default,
            {
              href: child.href,
              className: `nav-child ${isChildActive(child.href) ? "active" : ""}`,
              children: [
                /* @__PURE__ */ jsx("span", { className: "nav-dot" }),
                child.label
              ]
            },
            child.label
          )) })
        ] }, item.label);
      }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "admin-content", children: [
      /* @__PURE__ */ jsxs("header", { className: "admin-header", children: [
        /* @__PURE__ */ jsx("button", { onClick: () => setSidebarOpen((p) => !p), className: "menu-btn", children: /* @__PURE__ */ jsx(Menu, { size: 22 }) }),
        /* @__PURE__ */ jsx("h1", { className: "admin-title", children: title }),
        /* @__PURE__ */ jsx("a", { href: "/", target: "_blank", className: "site-link", children: "Перейти на сайт" })
      ] }),
      /* @__PURE__ */ jsx("main", { className: "admin-main", children })
    ] })
  ] });
}
const __vite_glob_0_6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Layout
}, Symbol.toStringTag, { value: "Module" }));
function FormField({ label, id, error, children }) {
  return /* @__PURE__ */ jsxs("div", { className: "form-field", children: [
    /* @__PURE__ */ jsx("label", { className: "form-label", htmlFor: id, children: label }),
    children,
    error && /* @__PURE__ */ jsx("p", { className: "form-error", children: error })
  ] });
}
function FormWrapper({ title, children, onSubmit, processing, cancelHref, submitLabel = "Сохранить" }) {
  return /* @__PURE__ */ jsxs("div", { className: "form-wrapper", children: [
    /* @__PURE__ */ jsx("div", { className: "form-wrapper-header", children: /* @__PURE__ */ jsx("h2", { className: "form-wrapper-title", children: title }) }),
    /* @__PURE__ */ jsxs("form", { onSubmit, children: [
      /* @__PURE__ */ jsx("div", { className: "form-wrapper-body", children }),
      /* @__PURE__ */ jsxs("div", { className: "form-wrapper-footer", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            disabled: processing,
            className: "btn-primary",
            children: processing ? "Сохранение..." : submitLabel
          }
        ),
        cancelHref && /* @__PURE__ */ jsx(Link_default, { href: cancelHref, className: "btn-cancel", children: "Отмена" })
      ] })
    ] })
  ] });
}
function Create$2({ products }) {
  const { data, setData, post, processing, errors } = useForm({
    name: "",
    product: "",
    price: "",
    old_price: "",
    is_active: false,
    mainImage: "",
    description: ""
  });
  const [preview, setPreview] = useState("/default.jpg");
  const handleSubmit = (e) => {
    e.preventDefault();
    post("/admin/cards", { forceFormData: true });
  };
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setData("mainImage", file);
    const url = URL.createObjectURL(file);
    setPreview(url);
  };
  return /* @__PURE__ */ jsx(Layout, { title: "Новая карточка товара", children: /* @__PURE__ */ jsxs(
    FormWrapper,
    {
      title: "Создание карточки товара",
      onSubmit: handleSubmit,
      cancelHref: "/admin/cards",
      processing,
      submitLabel: "Создать карточку товара",
      children: [
        /* @__PURE__ */ jsx(FormField, { label: "Наименование", id: "name", error: errors.name, children: /* @__PURE__ */ jsx(
          "input",
          {
            id: "name",
            type: "text",
            value: data.name,
            onChange: (e) => setData("name", e.target.value),
            className: `form-input ${errors.name ? "error" : ""}`,
            placeholder: "Наименование"
          }
        ) }),
        /* @__PURE__ */ jsx(FormField, { label: "Товар", id: "product", error: errors.product, children: /* @__PURE__ */ jsx(
          "select",
          {
            id: "product",
            value: data.product,
            onChange: (e) => setData("product", e.target.value),
            disabled: products.length === 0,
            className: `form-input ${errors.product ? "error" : ""}`,
            children: products.length > 0 ? /* @__PURE__ */ jsxs(Fragment$1, { children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "— Выберите товар —" }),
              products.map((product) => /* @__PURE__ */ jsx("option", { value: product.id, children: product.name }, product.id))
            ] }) : /* @__PURE__ */ jsx("option", { value: "", children: "Все товары уже имеют карточку (сначала добавьте новый товар)" })
          }
        ) }),
        /* @__PURE__ */ jsx(FormField, { label: "Цена", id: "price", error: errors.price, children: /* @__PURE__ */ jsx(
          "input",
          {
            id: "price",
            type: "text",
            value: data.price,
            onChange: (e) => setData("price", e.target.value),
            className: `form-input ${errors.price ? "error" : ""}`,
            placeholder: "Цена"
          }
        ) }),
        /* @__PURE__ */ jsx(FormField, { label: "Старая цена", id: "old_price", error: errors.old_price, children: /* @__PURE__ */ jsx(
          "input",
          {
            id: "old_price",
            type: "text",
            value: data.old_price,
            onChange: (e) => setData("old_price", e.target.value),
            className: `form-input ${errors.old_price ? "error" : ""}`,
            placeholder: "Старая цена"
          }
        ) }),
        /* @__PURE__ */ jsx(FormField, { label: "Актуальность", id: "is_active", error: errors.is_active, children: /* @__PURE__ */ jsx("div", { className: "checkbox-layout", children: /* @__PURE__ */ jsx(
          "input",
          {
            type: "checkbox",
            id: "is_active",
            name: "is_active",
            checked: data.is_active,
            onChange: (e) => setData("is_active", e.target.checked)
          }
        ) }) }),
        /* @__PURE__ */ jsxs("div", { className: "image-field", children: [
          /* @__PURE__ */ jsx("label", { className: "form-label", children: "Изображение" }),
          /* @__PURE__ */ jsxs("div", { className: "image-field-inner", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "file",
                id: "mainImage",
                className: "file-input",
                onChange: handleImage
              }
            ),
            /* @__PURE__ */ jsx("label", { htmlFor: "mainImage", className: "file-label", children: "Выберите изображение" }),
            /* @__PURE__ */ jsx("div", { className: "image-preview", children: /* @__PURE__ */ jsx(
              "img",
              {
                src: preview,
                alt: "Фото товара",
                className: "preview-img"
              }
            ) })
          ] })
        ] }),
        /* @__PURE__ */ jsx(FormField, { label: "Описание", id: "description", error: errors.description, children: /* @__PURE__ */ jsx(
          "input",
          {
            id: "description",
            type: "text",
            value: data.description,
            onChange: (e) => setData("price", e.target.value),
            className: `form-input ${errors.description ? "error" : ""}`
          }
        ) })
      ]
    }
  ) });
}
const __vite_glob_0_0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Create$2
}, Symbol.toStringTag, { value: "Module" }));
function ImageGallery({ productId, initialImages = [] }) {
  const [images, setImages] = useState(initialImages);
  const [uploading, setUploading] = useState(false);
  const [previews, setPreviews] = useState([]);
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);
  const getCsrf = () => document.querySelector('meta[name="csrf-token"]')?.content;
  const handleFileSelect = async (files) => {
    const fileArray = Array.from(files);
    const valid = fileArray.filter(
      (f) => f.type.startsWith("image/") || f.type.startsWith("video/")
    );
    if (valid.length === 0) return;
    const newPreviews = valid.map((file) => ({
      id: `temp_${Date.now()}_${Math.random()}`,
      // временный уникальный id
      file,
      // URL.createObjectURL — создаёт временный blob URL для превью
      preview: URL.createObjectURL(file),
      type: file.type.startsWith("video/") ? "video" : "image"
    }));
    setPreviews((prev) => [...prev, ...newPreviews]);
    await uploadFiles(valid);
  };
  const uploadFiles = async (files) => {
    setUploading(true);
    const formData = new FormData();
    files.forEach((file) => formData.append("images[]", file));
    try {
      const response = await fetch(`/admin/products/${productId}/images`, {
        method: "POST",
        headers: {
          "X-CSRF-TOKEN": getCsrf()
        },
        body: formData
      });
      const uploaded = await response.json();
      setImages((prev) => [...prev, ...uploaded]);
      setPreviews([]);
    } catch (error) {
      console.error("Ошибка загрузки:", error);
    } finally {
      setUploading(false);
    }
  };
  const handleDelete = async (imageId) => {
    if (!confirm("Удалить изображение?")) return;
    try {
      await fetch(`/admin/images/${imageId}`, {
        method: "DELETE",
        headers: {
          "X-CSRF-TOKEN": getCsrf(),
          "Content-Type": "application/json"
        }
      });
      setImages((prev) => prev.filter((img) => img.id !== imageId));
    } catch (error) {
      console.error("Ошибка удаления:", error);
    }
  };
  const handleSetMain = async (imageId) => {
    const updated = images.map((img) => ({
      ...img,
      is_main: img.id === imageId
      // true только у выбранного
    }));
    setImages(updated);
    await saveOrder(updated);
  };
  const handleDragStart = (e, index) => {
    dragItem.current = index;
    e.dataTransfer.effectAllowed = "move";
  };
  const handleDragOver = (e, index) => {
    e.preventDefault();
    dragOverItem.current = index;
  };
  const handleDrop = async () => {
    const from = dragItem.current;
    const to = dragOverItem.current;
    if (from === to) return;
    const reordered = [...images];
    const [moved] = reordered.splice(from, 1);
    reordered.splice(to, 0, moved);
    const withOrder = reordered.map((img, index) => ({
      ...img,
      sort_order: index + 1
    }));
    setImages(withOrder);
    dragItem.current = null;
    dragOverItem.current = null;
    await saveOrder(withOrder);
  };
  const saveOrder = async (imgs) => {
    await fetch(`/admin/products/${productId}/images/order`, {
      method: "PUT",
      headers: {
        "X-CSRF-TOKEN": getCsrf(),
        "Content-Type": "application/json"
      },
      // JSON.stringify — конвертирует объект в JSON строку
      body: JSON.stringify({
        images: imgs.map((img) => ({
          id: img.id,
          sort_order: img.sort_order,
          is_main: img.is_main
        }))
      })
    });
  };
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add("drag-over");
  };
  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove("drag-over");
  };
  const handleDropZone = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove("drag-over");
    handleFileSelect(e.dataTransfer.files);
  };
  return /* @__PURE__ */ jsxs("div", { className: "gallery", children: [
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: "upload-zone",
        onDragEnter: handleDragEnter,
        onDragOver: (e) => e.preventDefault(),
        onDragLeave: handleDragLeave,
        onDrop: handleDropZone,
        onClick: () => document.getElementById("gallery-input").click(),
        children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              id: "gallery-input",
              type: "file",
              multiple: true,
              accept: "image/*,video/*",
              className: "gallery-input-hidden",
              onChange: (e) => handleFileSelect(e.target.files)
            }
          ),
          uploading ? /* @__PURE__ */ jsx("p", { className: "upload-hint", children: "Загрузка..." }) : /* @__PURE__ */ jsxs(Fragment$1, { children: [
            /* @__PURE__ */ jsx("p", { className: "upload-icon", children: "📁" }),
            /* @__PURE__ */ jsx("p", { className: "upload-hint", children: "Перетащите файлы или нажмите для выбора" }),
            /* @__PURE__ */ jsx("p", { className: "upload-sub", children: "до 20 файлов, фото и видео" })
          ] })
        ]
      }
    ),
    previews.length > 0 && /* @__PURE__ */ jsx("div", { className: "previews-uploading", children: previews.map((p) => /* @__PURE__ */ jsxs("div", { className: "preview-uploading", children: [
      p.type === "video" ? /* @__PURE__ */ jsx("video", { src: p.preview, className: "preview-media" }) : /* @__PURE__ */ jsx("img", { src: p.preview, className: "preview-media", alt: "" }),
      /* @__PURE__ */ jsx("div", { className: "preview-uploading-overlay", children: /* @__PURE__ */ jsx("span", { children: "Загрузка..." }) })
    ] }, p.id)) }),
    images.length > 0 && /* @__PURE__ */ jsx("div", { className: "gallery-grid", children: images.map((image, index) => /* @__PURE__ */ jsxs(
      "div",
      {
        className: `gallery-item ${image.is_main ? "is-main" : ""}`,
        draggable: true,
        onDragStart: (e) => handleDragStart(e, index),
        onDragOver: (e) => handleDragOver(e, index),
        onDrop: handleDrop,
        children: [
          image.type === "video" ? /* @__PURE__ */ jsx(
            "video",
            {
              src: image.url,
              className: "gallery-media",
              preload: "metadata"
            }
          ) : /* @__PURE__ */ jsx(
            "img",
            {
              src: image.url,
              alt: "",
              className: "gallery-media"
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "gallery-overlay", children: [
            /* @__PURE__ */ jsx("div", { className: "gallery-drag-handle", children: /* @__PURE__ */ jsx(GripVertical, { size: 20 }) }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                className: `gallery-btn btn-main ${image.is_main ? "active" : ""}`,
                onClick: () => handleSetMain(image.id),
                title: "Сделать главным",
                children: /* @__PURE__ */ jsx(Star, { size: 16 })
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                className: "gallery-btn btn-delete",
                onClick: () => handleDelete(image.id),
                title: "Удалить",
                children: /* @__PURE__ */ jsx(Trash2, { size: 16 })
              }
            )
          ] }),
          image.is_main && /* @__PURE__ */ jsx("span", { className: "main-badge", children: "Главное" }),
          /* @__PURE__ */ jsx("span", { className: "sort-badge", children: index + 1 })
        ]
      },
      image.id
    )) }),
    images.length === 0 && previews.length === 0 && /* @__PURE__ */ jsx("p", { className: "gallery-empty", children: "Изображений пока нет" })
  ] });
}
function ProductAttributeList({ attributes, onChange }) {
  const handleAdd = () => {
    onChange([
      ...attributes,
      { attribute_id: null, name: "", value: "", from_category: false }
    ]);
  };
  const handleNameChange = (index, value) => {
    const updated = attributes.map(
      (attr, i) => i === index ? { ...attr, name: value } : attr
    );
    onChange(updated);
  };
  const handleValueChange = (index, value) => {
    const updated = attributes.map(
      (attr, i) => i === index ? { ...attr, value } : attr
    );
    onChange(updated);
  };
  const handleRemove = (index) => {
    const updated = attributes.filter((_, i) => i !== index);
    onChange(updated);
  };
  return /* @__PURE__ */ jsxs("div", { className: "product-attribute-list", children: [
    /* @__PURE__ */ jsxs("div", { className: "attribute-list-header", children: [
      /* @__PURE__ */ jsx("label", { className: "form-label", children: "Характеристики" }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          onClick: handleAdd,
          className: "btn-add-attribute",
          children: [
            /* @__PURE__ */ jsx(Plus, { size: 14 }),
            "Добавить характеристику"
          ]
        }
      )
    ] }),
    attributes.length === 0 && /* @__PURE__ */ jsx("p", { className: "attribute-empty", children: "Характеристик пока нет" }),
    /* @__PURE__ */ jsx("div", { className: "attribute-fields", children: attributes.map((attr, index) => /* @__PURE__ */ jsxs("div", { className: "product-attribute-field", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          value: attr.name,
          onChange: (e) => handleNameChange(index, e.target.value),
          placeholder: "Название",
          className: "form-input",
          readOnly: attr.from_category
        }
      ),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          value: attr.value,
          onChange: (e) => handleValueChange(index, e.target.value),
          placeholder: "Значение",
          className: "form-input"
        }
      ),
      !attr.from_category ? /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => handleRemove(index),
          className: "btn-remove-attribute",
          title: "Удалить",
          children: /* @__PURE__ */ jsx(X, { size: 16 })
        }
      ) : (
        // Заглушка для выравнивания
        /* @__PURE__ */ jsx("div", { className: "btn-placeholder" })
      )
    ] }, index)) })
  ] });
}
function Edit$2({ cards, product, productImg, attributes }) {
  const { data, setData, put, processing, errors } = useForm({
    name: cards.name || "",
    price: cards.price || "",
    old_price: cards.old_price || "",
    stock: product.stock || "",
    is_active: cards.is_active || false,
    description: cards.description || "",
    attributes: attributes ?? []
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    put(`/admin/cards/${cards.id}`, { forceFormData: true });
  };
  return /* @__PURE__ */ jsx(Layout, { title: "Редактирование карточки", children: /* @__PURE__ */ jsxs(
    FormWrapper,
    {
      title: `Карточка ${cards.name}`,
      onSubmit: handleSubmit,
      processing,
      cancelHref: "/admin/cards",
      submitLabel: "Обновить карточку",
      children: [
        /* @__PURE__ */ jsx(FormField, { label: "Наименование карточки", id: "name", error: errors.name, children: /* @__PURE__ */ jsx(
          "input",
          {
            id: "name",
            type: "text",
            value: data.name,
            onChange: (e) => setData("name", e.target.value),
            className: `form-input ${errors.name ? "error" : ""}`
          }
        ) }),
        /* @__PURE__ */ jsx(FormField, { label: "Цена", id: "price", error: errors.price, children: /* @__PURE__ */ jsx(
          "input",
          {
            id: "price",
            type: "text",
            value: data.price,
            onChange: (e) => setData("price", e.target.value),
            className: `form-input ${errors.price ? "error" : ""}`
          }
        ) }),
        /* @__PURE__ */ jsx(FormField, { label: "Старая цена", id: "old_price", error: errors.old_price, children: /* @__PURE__ */ jsx(
          "input",
          {
            id: "old_price",
            type: "text",
            value: data.old_price,
            onChange: (e) => setData("old_price", e.target.value),
            className: `form-input ${errors.old_price ? "error" : ""}`
          }
        ) }),
        /* @__PURE__ */ jsx(FormField, { label: "Наличие", id: "stock", error: errors.stock, children: /* @__PURE__ */ jsx(
          "input",
          {
            id: "stock",
            type: "text",
            value: data.stock,
            onChange: (e) => setData("stock", e.target.value),
            className: `form-input ${errors.stock ? "error" : ""}`
          }
        ) }),
        /* @__PURE__ */ jsx(FormField, { label: "Актуальность", id: "is_active", error: errors.is_active, children: /* @__PURE__ */ jsx("div", { className: "checkbox-layout", children: /* @__PURE__ */ jsx(
          "input",
          {
            type: "checkbox",
            id: "is_active",
            name: "is_active",
            checked: data.is_active,
            onChange: (e) => setData("is_active", e.target.checked)
          }
        ) }) }),
        /* @__PURE__ */ jsx(
          ImageGallery,
          {
            productId: productImg.id,
            initialImages: productImg.images.map((img) => ({
              id: img.id,
              url: img.url,
              // image_url accessor
              is_main: img.is_main,
              sort_order: img.sort_order,
              type: img.type ?? "image"
              // если есть поле type
            }))
          }
        ),
        /* @__PURE__ */ jsx(
          ProductAttributeList,
          {
            attributes: data.attributes,
            onChange: (attrs) => setData("attributes", attrs)
          }
        ),
        /* @__PURE__ */ jsx(FormField, { label: "Описание", id: "description", error: errors.description, children: /* @__PURE__ */ jsx(
          "input",
          {
            id: "description",
            type: "text",
            value: data.description,
            onChange: (e) => setData("description", e.target.value),
            className: `form-input ${errors.description ? "error" : ""}`
          }
        ) })
      ]
    }
  ) });
}
const __vite_glob_0_1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Edit$2
}, Symbol.toStringTag, { value: "Module" }));
function Index$3({ cards }) {
  const handleDelete = (id) => {
    if (!confirm("Подтвердите удаление")) return;
    router3.delete(`/admin/cards/${id}`);
  };
  return /* @__PURE__ */ jsx(Layout, { title: "Карточки", children: /* @__PURE__ */ jsxs("div", { className: "table-wrap", children: [
    /* @__PURE__ */ jsxs("div", { className: "table-header", children: [
      /* @__PURE__ */ jsx("h2", { className: "table-title", children: "Список карточек" }),
      /* @__PURE__ */ jsxs(Link_default, { href: "/admin/cards/create", className: "btn-add", children: [
        /* @__PURE__ */ jsx(Plus, { size: 16 }),
        "Добавить карточку"
      ] })
    ] }),
    cards.data.length > 0 ? /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("table", { className: "data-table", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { children: "#" }),
        /* @__PURE__ */ jsx("th", { children: "Наименование карточки" }),
        /* @__PURE__ */ jsx("th", { children: "Наименование товара" }),
        /* @__PURE__ */ jsx("th", { children: "Цена" }),
        /* @__PURE__ */ jsx("th", { children: "Старая цена" }),
        /* @__PURE__ */ jsx("th", { children: "Наличие" }),
        /* @__PURE__ */ jsx("th", { children: "Актуальность" }),
        /* @__PURE__ */ jsx("th", { children: "Изображение" }),
        /* @__PURE__ */ jsx("th", { children: "Описание" }),
        /* @__PURE__ */ jsx("th", { children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { children: cards.data.map((card) => /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("td", { className: "td-id", children: card.id }),
        /* @__PURE__ */ jsx("td", { className: "td-name", children: card.name }),
        /* @__PURE__ */ jsx("td", { className: "td-name", children: card.product.name }),
        /* @__PURE__ */ jsx("td", { className: "td-name", children: card.price }),
        /* @__PURE__ */ jsx("td", { className: "td-price", children: card.old_price }),
        /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx(
          "span",
          {
            className: `badge ${card.product.stock > 0 ? "badge-green" : "badge-red"}`,
            children: card.product.stock > 0 ? `${card.product.stock} шт.` : "Нет в наличии"
          }
        ) }),
        /* @__PURE__ */ jsx("td", { className: "td-active", children: card.is_active ? /* @__PURE__ */ jsx(Check, { color: "#13812f" }) : /* @__PURE__ */ jsx(X, { color: "#f24545" }) }),
        /* @__PURE__ */ jsx("td", { className: "td-image", children: /* @__PURE__ */ jsx(
          "img",
          {
            src: card.product.image_url,
            alt: card.name,
            className: "product-img"
          }
        ) }),
        /* @__PURE__ */ jsx("td", { className: "td-name", children: card.description }),
        /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsxs("div", { className: "actions", children: [
          /* @__PURE__ */ jsx(
            Link_default,
            {
              href: `/admin/cards/${card.id}/edit`,
              className: "btn-edit",
              children: /* @__PURE__ */ jsx(Pencil, { size: 14 })
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => handleDelete(card.id),
              className: "btn-delete",
              children: /* @__PURE__ */ jsx(Trash2, { size: 14 })
            }
          )
        ] }) })
      ] }, card.id)) })
    ] }) }) : /* @__PURE__ */ jsx("div", { className: "table-empty", children: "Карточек пока нет" }),
    cards.links && /* @__PURE__ */ jsx("div", { className: "pagination", children: cards.links.map((link, i) => /* @__PURE__ */ jsx(
      Link_default,
      {
        href: link.url ?? "#",
        className: `page-link ${link.active ? "active" : link.url ? "available" : "disabled"}`,
        dangerouslySetInnerHTML: { __html: link.label }
      },
      i
    )) })
  ] }) });
}
const __vite_glob_0_2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Index$3
}, Symbol.toStringTag, { value: "Module" }));
function AttributeList({ attributes, onChange }) {
  const handleAdd = () => {
    onChange([
      ...attributes,
      { id: null, name: "" }
      // новый пустой атрибут
    ]);
  };
  const handleChange = (index, value) => {
    const updated = attributes.map(
      (attr, i) => i === index ? { ...attr, name: value } : attr
    );
    onChange(updated);
  };
  const handleRemove = (index) => {
    const updated = attributes.filter((_, i) => i !== index);
    onChange(updated);
  };
  return /* @__PURE__ */ jsxs("div", { className: "attribute-list", children: [
    /* @__PURE__ */ jsxs("div", { className: "attribute-list-header", children: [
      /* @__PURE__ */ jsx("label", { className: "form-label", children: "Характеристики" }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          onClick: handleAdd,
          className: "btn-add-attribute",
          children: [
            /* @__PURE__ */ jsx(Plus, { size: 14 }),
            "Добавить характеристику"
          ]
        }
      )
    ] }),
    attributes.length === 0 && /* @__PURE__ */ jsx("p", { className: "attribute-empty", children: "Характеристик пока нет" }),
    /* @__PURE__ */ jsx("div", { className: "attribute-fields", children: attributes.map((attr, index) => /* @__PURE__ */ jsxs("div", { className: "attribute-field", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          value: attr.name,
          onChange: (e) => handleChange(index, e.target.value),
          placeholder: "Название характеристики",
          className: "form-input"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => handleRemove(index),
          className: "btn-remove-attribute",
          title: "Удалить",
          children: /* @__PURE__ */ jsx(X, { size: 16 })
        }
      )
    ] }, index)) })
  ] });
}
function Create$1({ categories }) {
  const { data, setData, post, processing, errors } = useForm({
    name: "",
    parent: "",
    attributes: []
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    post("/admin/categories");
  };
  return /* @__PURE__ */ jsx(Layout, { title: "Новая Категория", children: /* @__PURE__ */ jsxs(
    FormWrapper,
    {
      title: "Создание категории",
      onSubmit: handleSubmit,
      cancelHref: "/admin/categories",
      processing,
      submitLabel: "Создать Категорию",
      children: [
        /* @__PURE__ */ jsx(FormField, { label: "Наименование", id: "name", error: errors.name, children: /* @__PURE__ */ jsx(
          "input",
          {
            id: "name",
            type: "text",
            value: data.name,
            onChange: (e) => setData("name", e.target.value),
            className: `form-input ${errors.name ? "error" : ""}`,
            placeholder: "Наименование"
          }
        ) }),
        /* @__PURE__ */ jsx(FormField, { label: "Родительская категория", id: "parent", error: errors.parent, children: /* @__PURE__ */ jsxs(
          "select",
          {
            id: "parent",
            value: data.parent,
            onChange: (e) => setData("parent", e.target.value),
            className: `form-input ${errors.parent ? "error" : ""}`,
            children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "— Выберите категорию —" }),
              /* @__PURE__ */ jsx("option", { value: "", children: "Нет" }),
              categories.map((cat) => /* @__PURE__ */ jsx("option", { value: cat.id, children: cat.name }, cat.id))
            ]
          }
        ) }),
        /* @__PURE__ */ jsx(
          AttributeList,
          {
            attributes: data.attributes,
            onChange: (attrs) => setData("attributes", attrs)
          }
        )
      ]
    }
  ) });
}
const __vite_glob_0_3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Create$1
}, Symbol.toStringTag, { value: "Module" }));
function Edit$1({ category, categories }) {
  const { data, setData, put, processing, errors } = useForm({
    name: category.name || "",
    parent: category.parent_id || "",
    attributes: category.attributes?.map((attr) => ({
      id: attr.id,
      name: attr.name
    })) ?? []
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    put(`/admin/categories/${category.id}`);
  };
  return /* @__PURE__ */ jsx(Layout, { title: "Редактирование категории", children: /* @__PURE__ */ jsxs(
    FormWrapper,
    {
      title: `Категория ${data.name}`,
      onSubmit: handleSubmit,
      processing,
      cancelHref: "/admin/categories",
      submitLabel: "Обновить Категорию",
      children: [
        /* @__PURE__ */ jsx(FormField, { label: "Наименование", id: "name", error: errors.name, children: /* @__PURE__ */ jsx(
          "input",
          {
            id: "name",
            type: "text",
            value: data.name,
            onChange: (e) => setData("name", e.target.value),
            className: `form-input ${errors.name ? "error" : ""}`
          }
        ) }),
        /* @__PURE__ */ jsx(FormField, { label: "Родительская категория", id: "parent", error: errors.parent, children: /* @__PURE__ */ jsxs(
          "select",
          {
            id: "parent",
            value: data.parent,
            onChange: (e) => setData("parent", e.target.value),
            className: `form-input ${errors.parent ? "error" : ""}`,
            children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "Нет" }),
              categories.map((cat) => /* @__PURE__ */ jsx("option", { value: cat.id, children: cat.name }, cat.id))
            ]
          }
        ) }),
        /* @__PURE__ */ jsx(
          AttributeList,
          {
            attributes: data.attributes,
            onChange: (attrs) => setData("attributes", attrs)
          }
        )
      ]
    }
  ) });
}
const __vite_glob_0_4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Edit$1
}, Symbol.toStringTag, { value: "Module" }));
function Index$2({ categories }) {
  const handleDelete = (id) => {
    if (!confirm("Подтвердите удаление")) return;
    router3.delete(`/admin/categories/${id}`);
  };
  return /* @__PURE__ */ jsx(Layout, { title: "Категории", children: /* @__PURE__ */ jsxs("div", { className: "table-wrapper", children: [
    /* @__PURE__ */ jsxs("div", { className: "table-header", children: [
      /* @__PURE__ */ jsx("h2", { className: "table-title", children: "Список категорий" }),
      /* @__PURE__ */ jsxs(Link_default, { href: "/admin/categories/create", className: "btn-add", children: [
        /* @__PURE__ */ jsx(Plus, { size: 16 }),
        "Добавить категорию"
      ] })
    ] }),
    categories.data.length > 0 ? /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("table", { className: "data-table", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { children: "#" }),
        /* @__PURE__ */ jsx("th", { children: "Наименование" }),
        /* @__PURE__ */ jsx("th", { children: "Родитель" }),
        /* @__PURE__ */ jsx("th", { children: "Действия" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { children: categories.data.map((category) => /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("td", { className: "td-id", children: category.id }),
        /* @__PURE__ */ jsx("td", { className: "td-name", children: category.name }),
        /* @__PURE__ */ jsx("td", { className: "td-category", children: category.parent ? category.parent.name : category.parent_id ? "Не найдена" : "Корневая" }),
        /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsxs("div", { className: "actions", children: [
          /* @__PURE__ */ jsx(
            Link_default,
            {
              href: `/admin/categories/${category.id}/edit`,
              className: "btn-edit",
              children: /* @__PURE__ */ jsx(Pencil, { size: 14 })
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => handleDelete(category.id),
              className: "btn-delete",
              children: /* @__PURE__ */ jsx(Trash2, { size: 14 })
            }
          )
        ] }) })
      ] }, category.id)) })
    ] }) }) : /* @__PURE__ */ jsx("div", { className: "table-empty", children: "Категорий пока нет" }),
    categories.links && /* @__PURE__ */ jsx("div", { className: "pagination", children: categories.links.map((link, i) => /* @__PURE__ */ jsx(
      Link_default,
      {
        href: link.url ?? "#",
        className: `page-link ${link.active ? "active" : link.url ? "available" : "disabled"}`,
        dangerouslySetInnerHTML: { __html: link.label }
      },
      i
    )) })
  ] }) });
}
const __vite_glob_0_5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Index$2
}, Symbol.toStringTag, { value: "Module" }));
function Main({}) {
  return /* @__PURE__ */ jsx(Layout, { title: "Главная" });
}
const __vite_glob_0_7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Main
}, Symbol.toStringTag, { value: "Module" }));
function Create({ categories }) {
  const { data, setData, post, processing, errors } = useForm({
    sku: "",
    name: "",
    stock: "",
    category: "",
    price: ""
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    post("/admin/products");
  };
  return /* @__PURE__ */ jsx(Layout, { title: "Новый товар", children: /* @__PURE__ */ jsxs(
    FormWrapper,
    {
      title: "Создание товара",
      onSubmit: handleSubmit,
      cancelHref: "/admin/products",
      processing,
      submitLabel: "Создать товар",
      children: [
        /* @__PURE__ */ jsx(FormField, { label: "SKU", id: "sku", error: errors.sku, children: /* @__PURE__ */ jsx(
          "input",
          {
            id: "sku",
            type: "text",
            value: data.sku,
            onChange: (e) => setData("sku", e.target.value),
            className: `form-input ${errors.sku ? "error" : ""}`,
            placeholder: "SKU"
          }
        ) }),
        /* @__PURE__ */ jsx(FormField, { label: "Наименование", id: "name", error: errors.name, children: /* @__PURE__ */ jsx(
          "input",
          {
            id: "name",
            type: "text",
            value: data.name,
            onChange: (e) => setData("name", e.target.value),
            className: `form-input ${errors.name ? "error" : ""}`,
            placeholder: "Наименование"
          }
        ) }),
        /* @__PURE__ */ jsx(FormField, { label: "Наличие", id: "stock", error: errors.stock, children: /* @__PURE__ */ jsx(
          "input",
          {
            id: "stock",
            type: "text",
            value: data.stock,
            onChange: (e) => setData("stock", e.target.value),
            className: `form-input ${errors.stock ? "error" : ""}`,
            placeholder: "Наличие"
          }
        ) }),
        /* @__PURE__ */ jsx(FormField, { label: "Категория", id: "category", error: errors.category, children: /* @__PURE__ */ jsxs(
          "select",
          {
            id: "category",
            value: data.category,
            onChange: (e) => setData("category", e.target.value),
            className: `form-input ${errors.category ? "error" : ""}`,
            children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "— Выберите категорию —" }),
              /* @__PURE__ */ jsx("option", { value: "", children: "Нет" }),
              categories.map((cat) => /* @__PURE__ */ jsx("option", { value: cat.id, children: cat.name }, cat.id))
            ]
          }
        ) }),
        /* @__PURE__ */ jsx(FormField, { label: "Себестоимость", id: "price", error: errors.price, children: /* @__PURE__ */ jsx(
          "input",
          {
            id: "price",
            type: "text",
            value: data.price,
            onChange: (e) => setData("price", e.target.value),
            className: `form-input ${errors.price ? "error" : ""}`,
            placeholder: "Себестоимость"
          }
        ) })
      ]
    }
  ) });
}
const __vite_glob_0_8 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Create
}, Symbol.toStringTag, { value: "Module" }));
function Edit({ products, categories }) {
  const { data, setData, put, processing, errors } = useForm({
    sku: products.sku || "",
    name: products.name || "",
    stock: products.stock || "",
    category: products.category?.id || "",
    price: products.price || ""
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    put(`/admin/products/${products.id}`);
  };
  return /* @__PURE__ */ jsx(Layout, { title: "Редактирование товара", children: /* @__PURE__ */ jsxs(
    FormWrapper,
    {
      title: `Товар ${products.name}`,
      onSubmit: handleSubmit,
      processing,
      cancelHref: "/admin/products",
      submitLabel: "Обновить товар",
      children: [
        /* @__PURE__ */ jsx(FormField, { label: "SKU", id: "sku", error: errors.sku, children: /* @__PURE__ */ jsx(
          "input",
          {
            id: "sku",
            type: "text",
            value: data.sku,
            onChange: (e) => setData("sku", e.target.value),
            className: `form-input ${errors.sku ? "error" : ""}`
          }
        ) }),
        /* @__PURE__ */ jsx(FormField, { label: "Наименование", id: "name", error: errors.name, children: /* @__PURE__ */ jsx(
          "input",
          {
            id: "name",
            type: "text",
            value: data.name,
            onChange: (e) => setData("name", e.target.value),
            className: `form-input ${errors.name ? "error" : ""}`
          }
        ) }),
        /* @__PURE__ */ jsx(FormField, { label: "Наличие", id: "stock", error: errors.stock, children: /* @__PURE__ */ jsx(
          "input",
          {
            id: "stock",
            type: "text",
            value: data.stock,
            onChange: (e) => setData("stock", e.target.value),
            className: `form-input ${errors.stock ? "error" : ""}`
          }
        ) }),
        /* @__PURE__ */ jsx(FormField, { label: "Категория", id: "category", error: errors.category, children: /* @__PURE__ */ jsxs(
          "select",
          {
            id: "category",
            value: data.category,
            onChange: (e) => setData("category", e.target.value),
            className: `form-input ${errors.category ? "error" : ""}`,
            children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "Нет" }),
              categories.map((cat) => /* @__PURE__ */ jsx("option", { value: cat.id, children: cat.name }, cat.id))
            ]
          }
        ) }),
        /* @__PURE__ */ jsx(FormField, { label: "Себестоимость", id: "price", error: errors.price, children: /* @__PURE__ */ jsx(
          "input",
          {
            id: "price",
            type: "text",
            value: data.price,
            onChange: (e) => setData("price", e.target.value),
            className: `form-input ${errors.price ? "error" : ""}`
          }
        ) })
      ]
    }
  ) });
}
const __vite_glob_0_9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Edit
}, Symbol.toStringTag, { value: "Module" }));
function Index$1({ products }) {
  const handleDelete = (id) => {
    if (!confirm("Подтвердите удаление")) return;
    router3.delete(`/admin/products/${id}`);
  };
  return /* @__PURE__ */ jsx(Layout, { title: "Товары", children: /* @__PURE__ */ jsxs("div", { className: "table-wrap", children: [
    /* @__PURE__ */ jsxs("div", { className: "table-header", children: [
      /* @__PURE__ */ jsx("h2", { className: "table-title", children: "Список товаров" }),
      /* @__PURE__ */ jsxs(Link_default, { href: "/admin/products/create", className: "btn-add", children: [
        /* @__PURE__ */ jsx(Plus, { size: 16 }),
        "Добавить товар"
      ] })
    ] }),
    products.data.length > 0 ? /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("table", { className: "data-table", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { children: "#" }),
        /* @__PURE__ */ jsx("th", { children: "SKU" }),
        /* @__PURE__ */ jsx("th", { children: "Наименование" }),
        /* @__PURE__ */ jsx("th", { children: "Категория" }),
        /* @__PURE__ */ jsx("th", { children: "Наличие" }),
        /* @__PURE__ */ jsx("th", { children: "Себестоимость" }),
        /* @__PURE__ */ jsx("th", { children: "Действия" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { children: products.data.map((product) => /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("td", { className: "td-id", children: product.id }),
        /* @__PURE__ */ jsx("td", { className: "td-sku", children: product.sku }),
        /* @__PURE__ */ jsx("td", { className: "td-name", children: product.name }),
        /* @__PURE__ */ jsx("td", { className: "td-category", children: product.category?.name ?? "Нет категории" }),
        /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx(
          "span",
          {
            className: `badge ${product.stock > 0 ? "badge-green" : "badge-red"}`,
            children: product.stock > 0 ? `${product.stock} шт.` : "Нет в наличии"
          }
        ) }),
        /* @__PURE__ */ jsxs("td", { className: "td-price", children: [
          product.price,
          " ₽"
        ] }),
        /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsxs("div", { className: "actions", children: [
          /* @__PURE__ */ jsx(
            Link_default,
            {
              href: `/admin/products/${product.id}/edit`,
              className: "btn-edit",
              children: /* @__PURE__ */ jsx(Pencil, { size: 14 })
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => handleDelete(product.id),
              className: "btn-delete",
              children: /* @__PURE__ */ jsx(Trash2, { size: 14 })
            }
          )
        ] }) })
      ] }, product.id)) })
    ] }) }) : /* @__PURE__ */ jsx("div", { className: "table-empty", children: "Товаров пока нет" }),
    products.links && /* @__PURE__ */ jsx("div", { className: "pagination", children: products.links.map((link, i) => /* @__PURE__ */ jsx(
      Link_default,
      {
        href: link.url ?? "#",
        className: `page-link ${link.active ? "active" : link.url ? "available" : "disabled"}`,
        dangerouslySetInnerHTML: { __html: link.label }
      },
      i
    )) })
  ] }) });
}
const __vite_glob_0_10 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Index$1
}, Symbol.toStringTag, { value: "Module" }));
const CART_KEY = "cart";
const FAV_KEY = "favorites";
function readCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || {};
  } catch {
    return {};
  }
}
function readFavorites() {
  try {
    return JSON.parse(localStorage.getItem(FAV_KEY)) || [];
  } catch {
    return [];
  }
}
function CardImage({ cards }) {
  const [qty, setQty] = useState(() => readCart()[cards.id] || 0);
  const [isFav, setIsFav] = useState(() => readFavorites().includes(cards.id));
  const updateCart = (newQty) => {
    const cart = readCart();
    if (newQty <= 0) {
      delete cart[cards.id];
    } else {
      cart[cards.id] = newQty;
    }
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    window.dispatchEvent(new Event("cart-updated"));
    setQty(newQty);
  };
  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    updateCart(qty + 1);
  };
  const handleInc = (e) => {
    e.preventDefault();
    e.stopPropagation();
    updateCart(qty + 1);
  };
  const handleDec = (e) => {
    e.preventDefault();
    e.stopPropagation();
    updateCart(Math.max(0, qty - 1));
  };
  const handleFav = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const favs = readFavorites();
    const next = isFav ? favs.filter((id) => id !== cards.id) : [...favs, cards.id];
    localStorage.setItem(FAV_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event("favorites-updated"));
    setIsFav(!isFav);
  };
  return /* @__PURE__ */ jsx("div", { className: "card-item", children: /* @__PURE__ */ jsxs(Link_default, { href: `/catalog/${cards.product.slug}`, children: [
    /* @__PURE__ */ jsx("div", { className: "card-image", children: /* @__PURE__ */ jsx(
      "img",
      {
        src: cards.product.image_url,
        alt: cards.name
      }
    ) }),
    /* @__PURE__ */ jsxs("div", { className: "van-card-body", children: [
      /* @__PURE__ */ jsxs("div", { className: "card-price", children: [
        /* @__PURE__ */ jsxs("span", { className: "price-current", children: [
          cards.price,
          " ₽"
        ] }),
        cards.old_price && /* @__PURE__ */ jsxs("span", { className: "price-old", children: [
          cards.old_price,
          " ₽"
        ] })
      ] }),
      /* @__PURE__ */ jsx("h3", { className: "card-title", children: cards.name })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "card-actions", children: [
      qty === 0 ? /* @__PURE__ */ jsxs("button", { className: "btn-cart", onClick: handleAdd, children: [
        /* @__PURE__ */ jsx(ShoppingCart, {}),
        "  В корзину"
      ] }) : /* @__PURE__ */ jsxs("div", { className: "btn-cart btn-cart--counter", children: [
        /* @__PURE__ */ jsx("button", { className: "cnt-btn", onClick: handleDec, "aria-label": "Уменьшить", children: /* @__PURE__ */ jsx(Minus, { size: 14 }) }),
        /* @__PURE__ */ jsx("span", { className: "cnt-num", children: qty }),
        /* @__PURE__ */ jsx("button", { className: "cnt-btn", onClick: handleInc, "aria-label": "Увеличить", children: /* @__PURE__ */ jsx(Plus, { size: 14 }) })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          className: `btn-favorite ${isFav ? "btn-favorite--active" : ""}`,
          onClick: handleFav,
          "aria-label": "В избранное",
          children: /* @__PURE__ */ jsx(Heart, { size: 15, fill: isFav ? "currentColor" : "none" })
        }
      )
    ] })
  ] }) });
}
function Index({ cards }) {
  return /* @__PURE__ */ jsxs("main", { children: [
    cards.data.length > 0 ? /* @__PURE__ */ jsx("div", { className: "card-wrapper card-flex", children: /* @__PURE__ */ jsx("div", { className: "card-layout", children: cards.data.map((cards2) => /* @__PURE__ */ jsx(CardImage, { cards: cards2 }, cards2.id)) }) }) : /* @__PURE__ */ jsx("div", { className: "px-6 py-12 text-center text-gray-400 text-sm", children: "Товаров пока нет" }),
    /* @__PURE__ */ jsx("div", {})
  ] });
}
const __vite_glob_0_11 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Index
}, Symbol.toStringTag, { value: "Module" }));
const __vite_glob_0_12 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null
}, Symbol.toStringTag, { value: "Module" }));
function Test({ message }) {
  const [count, setCount] = useState(0);
  return /* @__PURE__ */ jsxs("div", { style: { padding: "60px", backgroundColor: "#f8f9fa", minHeight: "100vh" }, children: [
    /* @__PURE__ */ jsx("h1", { style: { color: "#dc3545", fontSize: "3.5rem" }, children: "ТЕСТ РАБОТАЕТ!" }),
    /* @__PURE__ */ jsx("h1", { style: { color: "#dc3545", fontSize: "3.5rem" }, children: "SSR ТЕСТ" }),
    /* @__PURE__ */ jsxs("p", { style: { fontSize: "1.8rem" }, children: [
      "Сообщение от Laravel: ",
      message
    ] }),
    /* @__PURE__ */ jsxs("div", { style: { marginTop: "30px" }, children: [
      /* @__PURE__ */ jsxs("p", { style: { fontSize: "1.5rem" }, children: [
        "Счётчик: ",
        count
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setCount(count + 1),
          style: { padding: "15px 30px", fontSize: "1.2rem", backgroundColor: "#198754", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" },
          children: "+1"
        }
      )
    ] })
  ] });
}
const __vite_glob_0_13 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Test
}, Symbol.toStringTag, { value: "Module" }));
createServer((page) => {
  return createInertiaApp({
    page,
    render: ReactDOMServer.renderToString,
    resolve: (name) => {
      const pages = /* @__PURE__ */ Object.assign({ "./Pages/Admin/Cards/Create/Create.jsx": __vite_glob_0_0, "./Pages/Admin/Cards/Edit/Edit.jsx": __vite_glob_0_1, "./Pages/Admin/Cards/Index/Index.jsx": __vite_glob_0_2, "./Pages/Admin/Categories/Create/Create.jsx": __vite_glob_0_3, "./Pages/Admin/Categories/Edit/Edit.jsx": __vite_glob_0_4, "./Pages/Admin/Categories/Index/Index.jsx": __vite_glob_0_5, "./Pages/Admin/Layout/Layout.jsx": __vite_glob_0_6, "./Pages/Admin/Main/Main.jsx": __vite_glob_0_7, "./Pages/Admin/Products/Create/Create.jsx": __vite_glob_0_8, "./Pages/Admin/Products/Edit/Edit.jsx": __vite_glob_0_9, "./Pages/Admin/Products/Index/Index.jsx": __vite_glob_0_10, "./Pages/Client/Index/Index.jsx": __vite_glob_0_11, "./Pages/NotFound.jsx": __vite_glob_0_12, "./Pages/Test.jsx": __vite_glob_0_13 });
      return pages[`./Pages/${name}.jsx`];
    },
    setup: ({ App: App2, props }) => /* @__PURE__ */ jsx(App2, { ...props })
  });
});
